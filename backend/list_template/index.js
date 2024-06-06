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
    validateBody,
    authenticateUser
  } = await shared.getShared();
  try {
    if (healthCheck(req, res)) return;
    const reqBody = await getBody(req);
    await validateBody(reqBody, 'paginationAndSearchSchema');
    // const userInfo: UserInfo = await authenticateUser(req)

    // if (userInfo.error) {
    //   sendResponse(res, 400, { success: false, msg: userInfo.error })
    //   return
    // }

    const {
      page_number = 1,
      limit = 10,
      search = ''
    } = reqBody;
    const skip = (page_number - 1) * limit;
    let searchValue = `%${search}%`;
    const templatesCount = await prisma.$queryRaw`SELECT COUNT(*) as total FROM (
      SELECT 
          t.id,
          t.name,
          t.category_id,
          t.category_name,
          t.language_id,
          t.language_name,
          t.template_type,
          t.template_body,
          t.template_header,
          t.template_footer,
          t.template_uuid,
          t.status,
          t.buttons_type,
          t.type,
          t.created_at,
          t.updated_at,
          t.project_id,
          json_agg(json_build_object('id', tmcp.id, 'paramName', tmcp."param_name",'param_value',tmcp."param_value",
           'paramOrder',tmcp."param_order",'paramType',tmcp."param_type")) AS template_message_custom_params,
            t."project_id",
          json_agg(json_build_object('id', tmb.id, 'buttonArray', tmb."button_array")) AS template_message_buttons    
      FROM templates as t
      LEFT JOIN template_message_buttons as tmb ON t.id = tmb.template_message_id
      LEFT JOIN template_message_custom_parameters as tmcp ON t.id = tmcp.template_message_id
      WHERE t.project_id =${reqBody.project_id}
      AND t.name ILIKE ${searchValue}
      GROUP BY 
          t.id,
          t.name,
          t.category_id,
          t.category_name,
          t.language_id,
          t.language_name,
          t.template_type,
          t.template_body,
          t.template_header,
          t.template_footer,
          t.template_uuid,
          t.status,
          t.buttons_type,
          t.type,
          t.created_at,
          t.updated_at,
          t.project_id
  ) as subquery;
  `;
    const templatesInfo = await prisma.$queryRaw`
    SELECT 
    t.id,
          t.name,
          t.category_id,
          t.category_name,
          t.language_id,
          t.language_name,
          t.template_type,
          t.template_body,
          t.template_header,
          t.template_footer,
          t.template_uuid,
          t.status,
          t.buttons_type,
          t.type,
          t.created_at,
          t.updated_at,
          t.project_id,
          json_agg(json_build_object('id', tmcp.id, 'paramName', tmcp."param_name",'param_value',tmcp."param_value",
           'paramOrder',tmcp."param_order",'paramType',tmcp."param_type")) AS template_message_custom_params,
            t."project_id",
          json_agg(json_build_object('id', tmb.id, 'buttonArray', tmb."button_array")) AS template_message_buttons    
      FROM templates as t
      LEFT JOIN template_message_buttons as tmb ON t.id = tmb.template_message_id
      LEFT JOIN template_message_custom_parameters as tmcp ON t.id = tmcp.template_message_id
      WHERE t.project_id =${reqBody.project_id}
      AND t.name ILIKE ${searchValue}
      GROUP BY 
          t.id,
          t.name,
          t.category_id,
          t.category_name,
          t.language_id,
          t.language_name,
          t.template_type,
          t.template_body,
          t.template_header,
          t.template_footer,
          t.template_uuid,
          t.status,
          t.buttons_type,
          t.type,
          t.created_at,
          t.updated_at,
          t.project_id
    LIMIT ${limit} 
    OFFSET ${skip};`;
    sendResponse(res, 200, {
      success: true,
      msg: `templates retrived successfully`,
      data: templatesInfo,
      count: templatesCount[0].total
    });
  } catch (error) {
    console.error('Error retriving templates:', error);
  }
};
export default handler;
