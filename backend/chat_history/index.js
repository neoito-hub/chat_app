import { shared } from '@appblocks/node-sdk';
const handler = async event => {
  const {
    req,
    res
  } = event;
  const {
    prisma,
    healthCheck,
    getBody,
    sendResponse,
    authenticateUser,
    validateBody
  } = await shared.getShared();
  if (healthCheck(req, res)) return;
  const userInfo = await authenticateUser(req);
  if (userInfo.error) {
    sendResponse(res, 400, {
      success: false,
      msg: userInfo.error
    });
    return;
  }
  const reqBody = await getBody(req);
  await validateBody(reqBody, 'chatHistorySchema');
  const chat_id = reqBody.chat_id;
  const pageNumber = reqBody?.page_number;
  const limit = reqBody?.limit;
  const offset = (pageNumber - 1) * limit;
  const messsagesCountFetchQuery = `SELECT COUNT(*) as total FROM (
    SELECT 
    *
    FROM  individual_chat_details as icd
    WHERE icd.chat_id =$1
) as subquery`;
  const messageCount = await prisma.$queryRawUnsafe(messsagesCountFetchQuery, chat_id);
  const mesageDetailsFetchQuery = `
  SELECT *
  FROM individual_chat_details as icd
  WHERE icd.chat_id =$1
  LIMIT $2 OFFSET $3;
`;
  const messages = await prisma.$queryRawUnsafe(mesageDetailsFetchQuery, chat_id, limit, offset);
  messages.forEach(chat => {
    if (chat.sender_id === userInfo?.id) {
      chat.is_owner = true;
    } else {
      chat.is_owner = false;
    }
  });
  const result = {
    messages,
    count: messageCount[0].total
  };
  return sendResponse(res, 200, {
    message: 'Messages list retrived successfully',
    data: result
  });
};
export default handler;
