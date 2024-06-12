import shield from "./shieldUtils.js";

const authenticateUser = async (req) => {
  try {
    // Get user details using shield
    const userDetails = await shield.getUser(req);

    return {id:userDetails.user_id}
  } catch (e) {
    // handle the error
    const error = new Error("Authentication Error");
    error.errorCode = 401;
    throw error;
  }
};

// const authenticateUser = async (req) => {
//   const user = await getUser(req);
//   console.log("user is", user);
//   const authHeader = req.headers.get("authorization");
//   const token = authHeader && authHeader.split(" ")[1];

//   try {
//     if (token == null) throw new Error();
//     const data = jwt.verify(token, process.env.BB_AUTH_SECRET_KEY.toString());
//     return data;
//   } catch (e) {
//     console.log("error is", e);
//     const error = new Error("An error occurred.");
//     error.errorCode = 401;
//     throw error;
//   }
// };

export default authenticateUser;
