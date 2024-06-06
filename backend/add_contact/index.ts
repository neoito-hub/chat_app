import { shared } from '@appblocks/node-sdk'
import { nanoid } from 'nanoid'
import { Request, Response } from 'express'
import { RequesBody, UserInfo } from './interface.ts'

const handler = async (event: { req: Request; res: Response }): Promise<void> => {
  const { req, res } = event

  const { prisma, healthCheck, getBody, sendResponse, authenticateUser, validateBody, validatePhoneNumber } =
    await shared.getShared()

  if (healthCheck(req, res)) return

  const reqBody: RequesBody = await getBody(req)
  await validateBody(reqBody, 'addContactSchema')
  const userInfo: UserInfo = await authenticateUser(req)

  if (userInfo.error) {
    sendResponse(res, 400, { success: false, msg: userInfo.error })
    return
  }

  let channelId = nanoid()
  let data = []

  //Here we are inserting shield user and normal whatsapp contact
  if (reqBody.registered_user) {
    if (reqBody.id === '' || reqBody.id === null) {
      sendResponse(res, 400, { success: false, msg: 'shield user id is empty string or null' })
      return
    }
    const existingContact = await prisma.contacts.findFirst({
      where: {
        OR: [{ id: reqBody.id }, { email: reqBody.email }],
      },
    })

    if (existingContact) {
      sendResponse(res, 200, { success: true, msg: 'shield user already exists', data: existingContact })
      return
    }
    data = [{ channel_id: channelId, status: 'active', ...reqBody }]
  } else {
    const existingContact = await prisma.contacts.findFirst({
      where: {
        phone_number: reqBody.phone_number,
      },
    })

    if (existingContact) {
      sendResponse(res, 200, { success: true, msg: 'contact already exists' })
      return
    }
    data = [
      {
        channel_id: channelId,
        status: 'active',
        name: reqBody.name,
        country_code: reqBody.country_code,
        phone_number: reqBody.phone_number,
        email: reqBody.email,
        address: reqBody.address,
        project_id: reqBody.project_id,
        registered_user: reqBody.registered_user,
      },
    ]
  }

  const newContact = await prisma.contacts.create({
    data: data[0],
  })

  const getValidatedPhoneNumber = await validatePhoneNumber(reqBody.phone_number, reqBody.country_code)

  const parameters = [
    {
      contact_id: newContact.id,
      name: 'name',
      value: reqBody?.name,
      status: 'active',
    },
    {
      contact_id: newContact.id,
      name: 'phone',
      value: getValidatedPhoneNumber.phone_number_with_country_code,
      status: 'active',
    },
  ]

  await prisma.candidate_custom_parameters.createMany({
    data: parameters,
  })

  return sendResponse(res, 200, {
    message: 'Contact created successfully',
    data: newContact,
  })
}

export default handler
