import shield from "./shieldUtils.js";
const sendResponse = (res, code, data, type = 'application/json') => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
    'Content-Type': type
  };

  // Custom JSON replacer function to handle BigInt values
  const bigIntReplacer = (key, value) => {
    if (typeof value === 'bigint') {
      return value.toString(); // Convert BigInt to string
    }
    return value;
  };
  const responseData = JSON.stringify(data, bigIntReplacer);
  headers['Content-Length'] = Buffer.byteLength(responseData, 'utf-8');
  res.writeHead(code, headers);
  res.write(responseData, 'utf-8', err => {
    if (err) {
      console.error('Error while sending response:', err);
    }
    res.end();
  });
};
export const getBody = req => {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const parsedBody = JSON.parse(body);
        resolve(parsedBody);
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', error => {
      reject(error);
    });
  });
};
const healthCheck = (req, res) => {
  if (req.params.health === 'health') {
    sendResponse(res, 200, {
      success: true,
      message: 'Health check success'
    });
    return true;
  }
  return false;
};
const authenticateUser = async req => {
  try {
    // Get user details using shield
    const userDetails = await shield.getUser(req);
    console.log("userDetails", userDetails);
    return {
      id: userDetails.user_id
    };
  } catch (e) {
    console.log(e);
    return {
      error: 'Authentication Error'
    };
  }
};
const validatePhoneNumber = async (phoneNumber, countryCode) => {
  const sanitizedCountryCode = String(countryCode).replace(/[^0-9]/g, '');
  const sanitizedPhoneNumber = String(phoneNumber).replace(/[^0-9]/g, '');
  const phoneNumberWithCountryCode = `${sanitizedCountryCode}${sanitizedPhoneNumber}`;
  const phoneNumberWithoutCountryCode = sanitizedPhoneNumber;
  return {
    phone_number_with_country_code: phoneNumberWithCountryCode,
    phone_number_without_country_code: phoneNumberWithoutCountryCode
  };
};
export default {
  getBody,
  authenticateUser,
  healthCheck,
  sendResponse,
  validatePhoneNumber
};
