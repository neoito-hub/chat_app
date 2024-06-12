import axios from "axios";

const shieldUrl = process.env.SHIELD_URL;

/**
 * Function that gets user details from shield.
 * @param {Request} req http request
 * @return {Object | Error} user details /Error
 */
const getUser = (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const userDetails = await callShieldServer(req, `${shieldUrl}/get-user`);
      resolve(userDetails);
    } catch (error) {
      reject(error.message || error);
    }
  });
};

export const callShieldServer = async (req, url) => {
  try {
    const authHeader = req.headers.get("authorization");

    const headers = {
      Accept: "application/json",
      Authorization: authHeader,
      "Content-Type": "application/json",
      "Client-Id": process.env.BLOCK_ENV_URL_CLIENT_ID,
      "Client-Secret": process.env.CHATBOT_CLIENT_SECRET,
    };

    const response = await axios.post(url, {}, { headers });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export default {
  getUser,
};
