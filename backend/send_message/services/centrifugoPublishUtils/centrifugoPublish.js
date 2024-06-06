import axios from 'axios';
const publishMessage = async (channels, data) => {
  const API_KEY = process.env.BB_CHAT_APP_CENTRIFUGO_API_KEY;
  const endpoint = process.env.BB_CHAT_APP_CENTRIFUGO_URL;
  const requestData = {
    channels: channels,
    data: data
  };
  const config = {
    headers: {
      'X-API-Key': API_KEY
    }
  };
  try {
    const response = await axios.post(endpoint, requestData, config);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error;
      console.error('Error:', axiosError.message);
      throw axiosError.message;
    } else {
      console.error('Error:', error);
      throw error;
    }
  }
};
export default publishMessage;
