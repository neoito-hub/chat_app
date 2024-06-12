import { shared } from '@appblocks/node-sdk'
import { RequestBody, UserInfo } from './interface.ts'
import { Request, Response } from 'express'
import axios from 'axios'

const handler = async (event: { req: Request; res: Response }): Promise<void> => {
  const { req, res } = event

  const { healthCheck, getBody, sendResponse, authenticateUser, validateBody, prisma } = await shared.getShared()

  if (healthCheck(req, res)) return

  const userInfo: UserInfo = await authenticateUser(req)

  if (userInfo.error) {
    sendResponse(res, 400, { success: false, msg: userInfo.error })
    return
  }

  try {
    const baseURL = process.env.BB_CHAT_APP_CHATBOT_URL
    const project_id = '972bfdec-dacf-43a3-a5b5-930795c01195'

    const reqBody: RequestBody = await getBody(req)
    await validateBody(reqBody, 'aiChatSchema')

    const { question, chat_id } = reqBody

    const messagesFetchQuery = `select icd.content 
    from individual_chat_details as icd
    where icd.chat_id =$1 
    order by icd.chat_id 
    Desc limit 5 
  `
    const result = await prisma.$queryRawUnsafe(messagesFetchQuery, chat_id)
    const historyArray = result.map((item) => item.content)
    const history = historyArray.join(',')
    const queryParams = { project_id }
    const requestBody = { query: question, history }

    const response = await axios.post(`${baseURL}/chat`, requestBody, {
      params: queryParams,
    })

    return sendResponse(res, 200, {
      message: 'Answer retrieved successfully',
      data: response.data,
    })
  } catch (error) {
    return sendResponse(res, 400, { message: error.message })
  }
}

export default handler
