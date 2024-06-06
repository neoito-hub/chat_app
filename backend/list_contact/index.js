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
  await validateBody(reqBody, 'listContactSchema');
  try {
    const offset = (reqBody.page_number - 1) * reqBody.limit;
    const limit = reqBody.limit;
    const project_id = reqBody.project_id;
    const search = reqBody.search;
    let searchValue = `%${search}%`;
    const contactsCount = await prisma.$queryRaw`SELECT COUNT(*) as total FROM (
      SELECT 
      *
      FROM contacts as c
      WHERE c.project_id =${project_id}
      AND c.name ILIKE ${searchValue}
      AND c.id != ${userInfo.id}
  ) as subquery;
  `;
    const contactsInfo = await prisma.$queryRaw`
      SELECT 
      *
      FROM contacts as c
      WHERE c.project_id =${project_id}
      AND c.name ILIKE ${searchValue}
      AND c.id != ${userInfo.id}
      LIMIT ${limit} 
      OFFSET ${offset};`;
    return sendResponse(res, 200, {
      message: 'Contacts retirved successfully',
      data: contactsInfo,
      count: contactsCount[0].total
    });
  } catch (error) {
    throw error;
  }
};
export default handler;
