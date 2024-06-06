import axios, { AxiosError, AxiosResponse } from 'axios'

const publishMessage = async (channels: string[], data: Record<string, any>) => {
  
  const API_KEY: string =  process.env.BB_CHAT_APP_CENTRIFUGO_API_KEY 
  const endpoint: string = process.env.BB_CHAT_APP_CENTRIFUGO_URL

  const requestData = {
    channels: channels,
    data: data,
  }

  const config = {
    headers: {
      'X-API-Key': API_KEY,
    },
  }

  try {
    const response: AxiosResponse = await axios.post(endpoint, requestData, config)
    return response
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError: AxiosError = error
      console.error('Error:', axiosError.message)
      throw axiosError.message
    } else {
      console.error('Error:', error)
      throw error
    }
  }
}

export default publishMessage
