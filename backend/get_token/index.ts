import jwt from 'jsonwebtoken'
import { shared } from '@appblocks/node-sdk'
import { Request,Response } from 'express'
import { UserInfo } from './interface.ts'

const handler = async (event: { req: Request; res: Response }): Promise<void>  => {
  const { req, res } = event

  const { healthCheck, sendResponse, authenticateUser } = await shared.getShared()

  // health check
  if (healthCheck(req, res)) return

  const userInfo: UserInfo = await authenticateUser(req)

  if (userInfo.error) {
    sendResponse(res, 400, { success: false, msg: userInfo.error })
    return
  }

  const secretKey: string = process.env.BB_CHAT_APP_CENTRIFUGO_SECRET_KEY
  const userID: string = 'user123'
  const expiresIn: number = 7200 // 2 hour

  const token: string = jwt.sign({ sub: userID }, secretKey, { expiresIn })

  return sendResponse(res, 200, {
    token: token,
    message: 'Token created successfully',
  })
}

export default handler
