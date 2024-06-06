import { shared } from '@appblocks/node-sdk'
import { Chat, Participants, RequesBody, UserInfo } from './interface.ts'
import { Request, Response } from 'express'

const handler = async (event: { req: Request; res: Response }): Promise<void> => {
  const { req, res } = event

  const { prisma, healthCheck, getBody, sendResponse, authenticateUser, validateBody } = await shared.getShared()

  if (healthCheck(req, res)) return

  // const userInfo: UserInfo = await authenticateUser(req)

  // if (userInfo.error) {
  //   sendResponse(res, 400, { success: false, msg: userInfo.error })
  //   return
  // }

  let userInfo = {
    id: '1',
  }
  const reqBody: RequesBody = await getBody(req)
  await validateBody(reqBody, 'chatListSchema')
  const pageNumber = reqBody?.page_number
  const search = reqBody?.search
  const searchValue = `%${search}%`
  const limit = reqBody?.limit
  const offset = (pageNumber - 1) * limit
  const projectId = reqBody?.project_id

  const contactsFetchQuery = `SELECT c.id FROM contacts as c WHERE c.project_id =$1`
  const contactDetails = await prisma.$queryRawUnsafe(contactsFetchQuery, projectId)
  const contactIds = contactDetails.map((obj) => obj.id)

  contactIds.push(userInfo.id)

  let chatIdFetchQuery = `
  SELECT p.chat_id
  FROM participants as p
  WHERE p.contact_id =  ANY ($1::text[])
`
  const params: any = [contactIds]

  chatIdFetchQuery += `
  ORDER BY created_at DESC
  LIMIT $2 OFFSET $3;
`
  params.push(limit, offset)
  const chat = await prisma.$queryRawUnsafe(chatIdFetchQuery, ...params)
  const chatIds = chat.map((obj) => obj.chat_id)

  const chatsCountFetchQuery = `SELECT COUNT(*) as total FROM (
    SELECT 
    *
    FROM chats as c
    WHERE c.id = ANY ($1::text[])
    OR c.chat_name ILIKE $2
    AND (
      c.chat_name ILIKE $2 OR
      c.latest_message ILIKE $2 OR
      EXISTS (
        SELECT 1
        FROM participants p
        JOIN contacts u ON p.contact_id = u.id
        WHERE p.chat_id = c.id
          AND (u.name ILIKE $2 OR u.email ILIKE $2)
      )
    )
) as subquery`

  const chatsCount = await prisma.$queryRawUnsafe(chatsCountFetchQuery, chatIds, searchValue)

  const chatDetailsFetchQuery = `
  SELECT * ,
  (
    SELECT json_agg(json_build_object('contact_id', p.contact_id, 'name', u.name, 'email', u.email))
    FROM participants p
    JOIN contacts u ON p.contact_id = u.id
    WHERE p.chat_id = c.id
) AS participants
  FROM chats as c 
  WHERE c.id = ANY ($1::text[])
  AND (
    c.chat_name ILIKE $2 OR
    c.latest_message ILIKE $2 OR
    EXISTS (
      SELECT 1
      FROM participants p
      JOIN contacts u ON p.contact_id = u.id
      WHERE p.chat_id = c.id
        AND (u.name ILIKE $2 OR u.email ILIKE $2)
    )
  )
  ORDER BY c.latest_message_created_time DESC
  LIMIT $3 OFFSET $4;
`
  const chatDetails = await prisma.$queryRawUnsafe(chatDetailsFetchQuery, chatIds, searchValue, limit, offset)

  const chatDetailsWithChatName = chatDetails.map((chat: Chat) => {
    const otherParticipants = chat.participants.filter(
      (participant: Participants) => participant.contact_id !== userInfo.id
    )
    const chatName = otherParticipants.map((participant: Participants) => participant.name).join(', ')
    const receiverId = otherParticipants.map((participant: Participants) => participant.contact_id).join(', ')

    return {
      ...chat,
      chat_name: chatName,
      receiver_id: receiverId,
    }
  })

  return sendResponse(res, 200, {
    message: 'Chat list retrived successfully',
    data: chatDetailsWithChatName,
    count: chatsCount[0].total,
  })
}

export default handler
