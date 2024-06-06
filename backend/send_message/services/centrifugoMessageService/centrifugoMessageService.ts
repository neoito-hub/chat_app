import { shared } from '@appblocks/node-sdk'
import { nanoid } from 'nanoid'

const { prisma } = await shared.getShared()

import { MessageSender, MessageContent } from '../../interface.ts'
import publishMessage from '../centrifugoPublishUtils/centrifugoPublish.ts'

export class CentrifugoMessageSender implements MessageSender {
  async sendMessage(content: MessageContent): Promise<string> {
    try {
      const { message, senderId, receiverId } = content

      //First We need to check new chat or existing chat
      let newChat: boolean = true
      const existingChat = await prisma.$queryRaw`
      SELECT p.chat_id
      FROM participants as p
      WHERE p.contact_id IN (${senderId}, ${receiverId})
      GROUP BY p.chat_id
      HAVING COUNT(DISTINCT p.contact_id) = 2
    `
      if (existingChat.length > 0) {
        newChat = false
      }

      if (newChat) {
        let channelId = nanoid()
        let chatUid = nanoid()
        const newChat = await prisma.chats.create({
          data: {
            channel_id: channelId,
            status: 'active',
            latest_message: message,
          },
        })

        const receiverInfo = await prisma.$queryRaw`select * from contacts as c where c.id =${receiverId}`

        const senderInfo = await prisma.$queryRaw`select * from contacts as c where c.id =${senderId}`

        let notifyMessagetData = {
          message: 'new chat',
          data: newChat?.channel_id,
        }

        let participants = [
          {
            contact_id: senderId,
            chat_id: newChat?.id,
          },
          {
            contact_id: receiverId,
            chat_id: newChat?.id,
          },
        ]

        await prisma.participants.createMany({
          data: participants,
        })
        await publishMessage([senderInfo[0].channel_id, receiverInfo[0]?.channel_id], notifyMessagetData)
        const newIndividualChat = await prisma.individual_chat_details.create({
          data: {
            chat_id: newChat?.id,
            content: message,
            sender_id: senderId,
            type: 'centrifugo', //centrifugo - 1, meta - 2
          },
        })

        let chatData = {
          message: newIndividualChat?.content,
        }
        await publishMessage([newChat?.channel_id], chatData)
        return 'message sent successfully'
      } else {
        await prisma.chats.update({
          where: {
            id: existingChat[0]?.chat_id,
          },
          data: {
            latest_message: message,
          },
        })
        const newIndividualChat = await prisma.individual_chat_details.create({
          data: {
            chat_id: existingChat[0]?.chat_id,
            content: message,
            sender_id: senderId,
            type: '1', //centrifugo - 1, meta - 2
          },
        })
        let chatData = {
          message: newIndividualChat?.content,
        }

        const chatDetails = await prisma.chats.findUnique({
          where: {
            id: existingChat[0]?.chat_id,
          },
        })
        await publishMessage([chatDetails?.channel_id], chatData)
        return 'message sent successfully'
      }
    } catch (error) {
      throw error
    }
  }
}
