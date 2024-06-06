import { shared } from '@appblocks/node-sdk';
import axios from 'axios';
import Busboy from 'busboy';
import path from 'path';
import { default as FormData } from 'form-data';
import fs from 'fs';
import { formats } from "./utils/constants/constants.js";
const __dirname = path.resolve(path.dirname(''));
const handler = async event => {
  const {
    req,
    res
  } = event;
  const {
    prisma,
    healthCheck,
    getBody,
    sendResponse,
    validateBody,
    authenticateUser
  } = await shared.getShared();
  try {
    // health check
    if (healthCheck(req, res)) return;
    const userInfo = await authenticateUser(req);
    if (userInfo.error) {
      sendResponse(res, 400, {
        success: false,
        msg: userInfo.error
      });
      return;
    }
    let fileName = '';
    let project_id = '';
    let saveTo = '';
    let fileSize = 0;
    await new Promise(resolve => {
      var busboy = Busboy({
        headers: req.headers
      });
      busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
        file.on('data', data => {
          fileSize += data.length;
        });
        saveTo = path.join(__dirname, filename.filename);
        fileName = filename.filename;
        file.pipe(fs.createWriteStream(saveTo));
      });
      busboy.on('field', (fieldname, value) => {
        if (fieldname === 'project_id') {
          project_id = value;
        }
      });
      busboy.on('finish', function () {
        resolve();
      });
      req.pipe(busboy);
    });
    let image = null;
    await new Promise(resolve => {
      fs.readFile(saveTo, function (err, content) {
        if (!err) {
          image = content;
          resolve();
        } else if (err) {
          return sendResponse(res, 500, {
            status: 'failed'
          });
        }
      });
    });
    const projectDetails = await prisma.projects.findFirst({
      where: {
        id: project_id
      }
    });
    if (project_id == '' || fileName == '') {
      sendResponse(res, 404, {
        success: false,
        msg: `Inavlid payload`
      });
    }
    const vendorDetails = await prisma.api_vendor.findFirst();
    const auth_config = {
      headers: {
        Authorization: `OAuth ${projectDetails?.whatsapp_business_token}`
      }
    };
    const base_url = vendorDetails.vendor_base_url;
    const api_version = vendorDetails.vendor_api_version;
    let split = fileName.split('.');
    let extension = split[split.length - 1].toLowerCase();
    if (!formats[`${extension}`]) {
      return sendResponse(res, 500, {
        message: 'Invalid Media Format'
      });
    }
    let url = base_url;
    let header = {};
    let file_data = null;
    let uploadSessionUrl = null;
    url = `${base_url}${api_version}/app/uploads`;
    let formData = new FormData();
    formData.append('file_length', fs.statSync(saveTo).size);
    formData.append('file_type', formats[`${extension}`]['contentType']);
    formData.append('file_name', fileName);
    header = {
      ...auth_config.headers,
      ...formData.getHeaders()
    };
    file_data = formData;
    const session = await axios.post(url, file_data, {
      headers: header
    }).then(response => {
      return response.data.id;
    }).catch(error => {
      return error?.response?.data;
    });
    if (session?.error) {
      return sendResponse(res, 500, {
        success: false,
        msg: session?.error?.message
      });
    }
    const apiUrl = `${base_url}${api_version}/${session}`;
    const accessToken = `${projectDetails?.whatsapp_business_token}`;
    const fileOffset = 0;
    const headers = {
      Authorization: `OAuth ${accessToken}`,
      file_offset: fileOffset
    };
    const upload = await axios.post(apiUrl, Buffer.from(image), {
      headers: headers,
      maxContentLength: Infinity,
      // Needed for large file uploads
      maxBodyLength: Infinity // Needed for large file uploads
    }).then(response => {
      return response.data.h;
    }).catch(error => {
      return error.message;
    });
    if (upload?.error) {
      return sendResponse(res, 500, {
        message: upload?.error?.message
      });
    }
    uploadSessionUrl = upload;
    await new Promise((resolve, reject) => {
      fs.unlink(fileName, err => {
        if (err) {
          reject(err);
        } else {
          console.log('success');
          resolve();
        }
      });
    });
    let responseObject = {
      session_url: uploadSessionUrl
    };
    sendResponse(res, 200, {
      success: true,
      msg: `file uploaded successfully`,
      data: responseObject
    });
  } catch (error) {
    console.error('Error sending message:', error);
  }
};
export default handler;
