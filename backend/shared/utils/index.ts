import shield from './shieldUtils.ts'
import { Request, Response } from 'express'
import { UserDetails } from './types.ts'

const sendResponse = (res: any, code: number, data: any, type: string = 'application/json'): void => {
  const headers: { [key: string]: number | string } = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
    'Content-Type': type,
  }

  // Custom JSON replacer function to handle BigInt values
  const bigIntReplacer = (key: string, value: any): any => {
    if (typeof value === 'bigint') {
      return value.toString() // Convert BigInt to string
    }
    return value
  }

  const responseData: string = JSON.stringify(data, bigIntReplacer)
  headers['Content-Length'] = Buffer.byteLength(responseData, 'utf-8')

  res.writeHead(code, headers)
  res.write(responseData, 'utf-8', (err: Error) => {
    if (err) {
      console.error('Error while sending response:', err)
    }
    res.end()
  })
}

export const getBody = (req: Request) => {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', (chunk: Buffer) => {
      body += chunk.toString()
    })
    req.on('end', () => {
      try {
        const parsedBody = JSON.parse(body)
        resolve(parsedBody)
      } catch (error) {
        reject(error)
      }
    })
    req.on('error', (error) => {
      reject(error)
    })
  })
}

const healthCheck = (req: Request, res: Response): boolean => {
  if (req.params.health === 'health') {
    sendResponse(res, 200, { success: true, message: 'Health check success' })
    return true
  }
  return false
}

const authenticateUser = async (req: Request): Promise<{ id: string } | { error: string }> => {
  try {
    // Get user details using shield
    const userDetails: UserDetails = await shield.getUser(req)
    console.log("userDetails",userDetails)
    return { id: userDetails.user_id }
  } catch (e) {
    console.log(e)
    return { error: 'Authentication Error' }
  }
}


const validatePhoneNumber = async (phoneNumber: string, countryCode: string): Promise<{ phone_number_with_country_code: string, phone_number_without_country_code: string }> => {
  const sanitizedCountryCode: string = String(countryCode).replace(/[^0-9]/g, '');
  const sanitizedPhoneNumber: string = String(phoneNumber).replace(/[^0-9]/g, '');
  const phoneNumberWithCountryCode: string = `${sanitizedCountryCode}${sanitizedPhoneNumber}`;
  const phoneNumberWithoutCountryCode: string = sanitizedPhoneNumber;
  return { phone_number_with_country_code: phoneNumberWithCountryCode, phone_number_without_country_code: phoneNumberWithoutCountryCode };
}


export default { getBody, authenticateUser, healthCheck,sendResponse,validatePhoneNumber }
