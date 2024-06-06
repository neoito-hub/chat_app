import { Request, Response } from 'express'
import { shared } from '@appblocks/node-sdk'

interface UserInfo {
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

    const languages = await prisma.template_languages.findMany()

    sendResponse(res, 200, { success: true, msg: `languages retrieved successfully`, data: languages })
  } catch (error) {
    console.error('Error retrieving languages:', error)
  }
}

export default handler
