import axios from 'axios';
const shieldUrl = process.env.BB_CHAT_APP_SHIELD_URL;

/**
 * Function that gets user details from shield.
 * @param {Request} req http request
 * @param {string} url URL for the shield server
 * @returns {Promise<Object>} user details
 */
export const callShieldServer = async (req, url) => {
  try {
    const authHeader = req.headers['authorization'];
    const headers = {
      Accept: 'application/json',
      Authorization: authHeader,
      'Content-Type': 'application/json',
      'Client-Id': process.env.BB_CHAT_APP_CLIENT_ID,
      'Client-Secret': process.env.BB_CHAT_APP_CLIENT_SECRET
    };
    const response = await axios.post(url, {}, {
      headers
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Function to get user details.
 * @param {Request} req http request
 * @returns {Promise<object>} user details
 */
const getUser = req => {
  return new Promise(async (resolve, reject) => {
    try {
      const userDetails = await callShieldServer(req, `${shieldUrl}/get-user`);
      console.log('userDetails', userDetails);
      resolve(userDetails);
    } catch (error) {
      reject(error.message || error);
      return error;
    }
  });
};
export default {
  getUser
};
