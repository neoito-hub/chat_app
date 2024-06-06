import { Request, Response } from 'express'
import { shared } from '@appblocks/node-sdk'

export interface UserInfo {
  error?: string
  id: string
}

const handler = async (event: { req: Request; res: Response }): Promise<void> => {
  const { req, res } = event

  const { prisma, healthCheck, sendResponse, authenticateUser } = await shared.getShared()

  try {
    // health check
    if (healthCheck(req, res)) return

    const userInfo: UserInfo = await authenticateUser(req)

    if (userInfo.error) {
      sendResponse(res, 400, { success: false, msg: userInfo.error })
      return
    }

    const categories = await prisma.template_categories.findMany()

    sendResponse(res, 200, { success: true, msg: `categories retrived successfully`, data: categories })
  } catch (error) {
    console.error('Error retriving categories:', error)
  }
}

export default handler
