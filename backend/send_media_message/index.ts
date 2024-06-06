import { Request, Response } from 'express'
import { shared } from '@appblocks/node-sdk'
import axios from 'axios'
import Busboy from 'busboy'
import path from 'path'
import { default as FormData } from 'form-data'
import fs from 'fs'
import { UserInfo, CandidateInfo, ChatInfo } from './interface.ts'
import { mediaSupportedFormats } from './utils/utils.ts'

const __dirname: string = path.resolve(path.dirname(''))

const handler = async (event: { req: Request; res: Response }): Promise<void> => {
  const { req, res } = event

  const { prisma, healthCheck, sendResponse, validateBody, authenticateUser } = await shared.getShared()

  try {
    // health check
    if (healthCheck(req, res)) return

    const userInfo: UserInfo = await authenticateUser(req)

    if (userInfo.error) {
      sendResponse(res, 400, { success: false, msg: userInfo.error })
      return
    }

    let fileName: string = ''
    let caption: string = ''
    let contactId: string = ''
    let project_id: string = ''
    let saveTo: string = ''
    let fileSize: string = ''

    // eslint-disable-next-line no-unused-vars
    await new Promise((resolve) => {
      var busboy = Busboy({ headers: req.headers })

      busboy.on(
        'file',
        // eslint-disable-next-line no-unused-vars
        function (fieldname, file, filename, encoding, mimetype) {
          file.on('data', (data) => {
            fileSize += data.length
            // ...
          })
          saveTo = path.join(__dirname, filename.filename)
          fileName = filename.filename
          file.pipe(fs.createWriteStream(saveTo))
        }
      )

      busboy.on('field', (fieldname, value) => {
        if (fieldname === 'caption') {
          caption = value
        } else if (fieldname === 'contact_id') {
          contactId = value
        } else if (fieldname === 'project_id') {
          project_id = value
        }
      })

      busboy.on('finish', function () {
        resolve(null)
      })

      req.pipe(busboy)
    })

    let data: any = null

    await new Promise((resolve) => {
      fs.readFile(saveTo, function (err, content) {
        if (!err) {
          data = content
          resolve(data)
        } else if (err) {
          return sendResponse(res, 500, { status: 'failed' })
        }
      })
    })

    const projectDetails: any = await prisma.projects.findFirst({
      where: {
        id: project_id,
      },
    })
    if (contactId == '' || project_id == '' || fileName == '') {
      sendResponse(res, 404, { success: false, msg: `Inavlid payload` })
    }

    const candidateInfo: CandidateInfo[] =
      await prisma.$queryRaw`select * from contacts as c where c."id" =${contactId} `

    if (!candidateInfo[0].id) {
      throw Error('Contact not found')
    }

    const item = await prisma.$queryRaw`
      select c.chat_id from participants as c
      where c.contact_id =${candidateInfo[0]?.id}`

    const chatInfo: ChatInfo[] = await prisma.$queryRaw`select * from chats as c where c.id =${item[0]?.chat_id}`
    const vendorDetails: any = await prisma.api_vendor.findFirst()

    const auth_config = {
      headers: {
        Authorization: `Bearer ${projectDetails?.whatsapp_business_token}`,
        'Content-Type': 'application/json',
      },
    }

    const BASE_URL: string = vendorDetails.vendor_base_url
    const phoneNumber_id: string = projectDetails.whatsapp_phone_number_id
    const api_version: string = vendorDetails.vendor_api_version

    let split: string[] = fileName.split('.')
    let extension: string = split[split.length - 1].toLowerCase()

    if (!mediaSupportedFormats[`${extension}`]) {
      return sendResponse(res, 500, { message: 'Invalid Media Format' })
    }
    let url: string = BASE_URL
    let header: any = {}
    let file_data: any = null

    url = BASE_URL + api_version + '/' + phoneNumber_id + '/media'
    let fromData = new FormData()
    fromData.append('file', fs.createReadStream(saveTo))
    fromData.append('type', mediaSupportedFormats[`${extension}`]['contentType'])
    fromData.append('messaging_product', 'whatsapp')
    header = { ...auth_config.headers, ...fromData.getHeaders() }
    file_data = fromData

    const response = await axios.post(url, file_data, { headers: header })

    let formatBody: any = null
    let resp_id: any = null

    resp_id = response.data.id

    if (mediaSupportedFormats[`${extension}`].type === 'document') {
      formatBody = {
        id: resp_id,
        filename: fileName,
      }
    } else {
      formatBody = {
        id: resp_id,
      }
    }

    if (caption) {
      formatBody = {
        ...formatBody,
        caption: caption,
      }
    }
    const axiosBodyData = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: candidateInfo[0]?.phone_number,
      type: mediaSupportedFormats[`${extension}`].type,
      [mediaSupportedFormats[`${extension}`].type]: formatBody,
    }

    url = BASE_URL + api_version + '/' + phoneNumber_id + '/messages'
    let message = await axios.post(url, axiosBodyData, auth_config)

    // eslint-disable-next-line no-inner-declarations
    await new Promise((resolve, reject) => {
      fs.unlink(fileName, (err) => {
        if (err) {
          reject(err)
        } else {
          // eslint-disable-next-line no-console
          console.log('success')
          resolve(null)
        }
      })
    })

    await prisma.$transaction(async (prisma) => {
      await prisma.individual_chat_details.create({
        data: {
          sender_id: userInfo?.id,
          receiver_id: candidateInfo[0].id,
          status: 'active',
          message_text: fileName,
          message_type: mediaSupportedFormats[`${extension}`].type,
          chat_id: chatInfo[0].id,
          event_type: 'message',
          time_stamp: new Date().toISOString(),
          wa_id: candidateInfo[0].phone_number,
          whatsapp_message_id: message?.data.messages[0]?.id,
          conversation_id: chatInfo[0].wa_conversation_id,
          sender_name: userInfo?.id,
          message_status_string: 'SENT',
          file_name: fileName,
          file_type: mediaSupportedFormats[`${extension}`].type,
          is_message_read: false,
          type: 'whatsapp',
        },
      })

      await prisma.chats.update({
        where: {
          id: chatInfo[0].id,
        },
        data: {
          status: 'open',
          latest_message: fileName,
          latest_message_created_time: new Date().toISOString(),
          last_message_type: mediaSupportedFormats[`${extension}`].type,
        },
      })
    })

    let responseData = {
      sender_id: userInfo?.id,
      reciever_id: candidateInfo[0].name,
      message: fileName,
    }

    sendResponse(res, 200, { success: true, msg: `message sent successfully`, data: responseData })
  } catch (error) {
    console.error('Error sending message:', error)
  }
}

export default handler
