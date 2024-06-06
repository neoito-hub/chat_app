import { shared } from '@appblocks/node-sdk'
import { Request, Response } from 'express'
import axios from 'axios'
import Busboy from 'busboy'
import path from 'path'
import { default as FormData } from 'form-data'
import fs from 'fs'
import { formats } from './utils/constants/constants.ts'
import { UserInfo, VendorDetails, ProjectDetails } from './interface.ts'

const __dirname: string = path.resolve(path.dirname(''))

const handler = async (event: { req: Request; res: Response }): Promise<void> => {
  const { req, res } = event

  const { prisma, healthCheck, getBody, sendResponse, validateBody, authenticateUser } = await shared.getShared()

  try {
    // health check
    if (healthCheck(req, res)) return

    const userInfo: UserInfo = await authenticateUser(req)

    if (userInfo.error) {
      sendResponse(res, 400, { success: false, msg: userInfo.error })
      return
    }

    let fileName: string = ''
    let project_id: string = ''
    let saveTo: string = ''
    let fileSize: number = 0

    await new Promise<void>((resolve) => {
      var busboy = Busboy({ headers: req.headers })

      busboy.on('file', function (fieldname: string, file: any, filename: any, encoding: string, mimetype: string) {
        file.on('data', (data: any) => {
          fileSize += data.length
        })
        saveTo = path.join(__dirname, filename.filename)
        fileName = filename.filename
        file.pipe(fs.createWriteStream(saveTo))
      })

      busboy.on('field', (fieldname: string, value: string) => {
        if (fieldname === 'project_id') {
          project_id = value
        }
      })

      busboy.on('finish', function () {
        resolve()
      })

      req.pipe(busboy)
    })

    let image: Buffer | null = null

    await new Promise<void>((resolve) => {
      fs.readFile(saveTo, function (err: NodeJS.ErrnoException | null, content: Buffer) {
        if (!err) {
          image = content
          resolve()
        } else if (err) {
          return sendResponse(res, 500, { status: 'failed' })
        }
      })
    })

    const projectDetails: ProjectDetails = await prisma.projects.findFirst({
      where: {
        id: project_id,
      },
    })
    if (project_id == '' || fileName == '') {
      sendResponse(res, 404, { success: false, msg: `Inavlid payload` })
    }

    const vendorDetails: VendorDetails = await prisma.api_vendor.findFirst()

    const auth_config = {
      headers: {
        Authorization: `OAuth ${projectDetails?.whatsapp_business_token}`,
      },
    }

    const base_url: string = vendorDetails.vendor_base_url
    const api_version: string = vendorDetails.vendor_api_version

    let split: string[] = fileName.split('.')
    let extension: string = split[split.length - 1].toLowerCase()

    if (!formats[`${extension}`]) {
      return sendResponse(res, 500, { message: 'Invalid Media Format' })
    }

    let url: string = base_url
    let header: any = {}
    let file_data: any = null
    let uploadSessionUrl: string | null = null

    url = `${base_url}${api_version}/app/uploads`

    let formData = new FormData()
    formData.append('file_length', fs.statSync(saveTo).size)
    formData.append('file_type', formats[`${extension}`]['contentType'])
    formData.append('file_name', fileName)
    header = { ...auth_config.headers, ...formData.getHeaders() }
    file_data = formData

    const session = await axios
      .post(url, file_data, { headers: header })
      .then((response) => {
        return response.data.id
      })
      .catch((error) => {
        return error?.response?.data
      })

    if (session?.error) {
      return sendResponse(res, 500, { success: false, msg: session?.error?.message })
    }

    const apiUrl: string = `${base_url}${api_version}/${session}`
    const accessToken: string = `${projectDetails?.whatsapp_business_token}`
    const fileOffset: number = 0

    const headers = {
      Authorization: `OAuth ${accessToken}`,
      file_offset: fileOffset,
    }

    const upload = await axios
      .post(apiUrl, Buffer.from(image), {
        headers: headers,
        maxContentLength: Infinity, // Needed for large file uploads
        maxBodyLength: Infinity, // Needed for large file uploads
      })
      .then((response) => {
        return response.data.h
      })
      .catch((error) => {
        return error.message
      })

    if (upload?.error) {
      return sendResponse(res, 500, { message: upload?.error?.message })
    }

    uploadSessionUrl = upload

    await new Promise<void>((resolve, reject) => {
      fs.unlink(fileName, (err) => {
        if (err) {
          reject(err)
        } else {
          console.log('success')
          resolve()
        }
      })
    })

    let responseObject = {
      session_url: uploadSessionUrl,
    }

    sendResponse(res, 200, { success: true, msg: `file uploaded successfully`, data: responseObject })
  } catch (error) {
    console.error('Error sending message:', error)
  }
}

export default handler
