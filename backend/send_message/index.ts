import { shared } from '@appblocks/node-sdk'
import { CentrifugoMessageSender } from './services/centrifugoMessageService/centrifugoMessageService.ts'

import { MessageSender, MessageContent } from './interface.ts'

const handler = async (event) => {
  const { req, res } = event

  const { healthCheck, getBody, sendResponse, authenticateUser } = await shared.getShared()

  // health check
  if (healthCheck(req, res)) return

  const userInfo = await authenticateUser(req)

  if (userInfo.error) {
    sendResponse(res, 400, { success: false, msg: userInfo.error })
    return
  }

  class ChatService {
    constructor(private messageSender: MessageSender) {}

    sendMessage(content: MessageContent): void {
      this.messageSender.sendMessage(content)
    }
  }

  const reqBody = await getBody(req)
  let messageSender: MessageSender

  messageSender = new CentrifugoMessageSender()

  const chatService = new ChatService(messageSender)

  chatService.sendMessage(reqBody)

  return sendResponse(res, 200, {
    message: 'message sent successfully',
  })
}

export default handler
