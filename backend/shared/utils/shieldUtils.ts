import axios, { AxiosResponse } from 'axios'
import { Request } from 'express'

const shieldUrl = process.env.BB_CHAT_APP_SHIELD_URL as string

/**
 * Function that gets user details from shield.
 * @param {Request} req http request
 * @param {string} url URL for the shield server
 * @returns {Promise<Object>} user details
 */
export const callShieldServer = async (req: Request, url: string): Promise<object> => {
  try {
    const authHeader: string | undefined = req.headers['authorization'] as string | undefined
    const headers = {
      Accept: 'application/json',
      Authorization: authHeader,
      'Content-Type': 'application/json',
      'Client-Id': process.env.BB_CHAT_APP_CLIENT_ID as string,
      'Client-Secret': process.env.BB_CHAT_APP_CLIENT_SECRET as string,
    }

    const response: AxiosResponse = await axios.post(url, {}, { headers })
    return response.data.data
  } catch (error) {
    throw error
  }
}

/**
 * Function to get user details.
 * @param {Request} req http request
 * @returns {Promise<object>} user details
 */
const getUser = (req: Request): Promise<object> => {
  return new Promise(async (resolve, reject) => {
    try {
      const userDetails: object = await callShieldServer(req, `${shieldUrl}/get-user`)
      console.log('userDetails', userDetails)
      resolve(userDetails)
    } catch (error) {
      reject(error.message || error)
      return error
    }
  })
}

export default {
  getUser,
}
