import { shared, Request, Response } from '@appblocks/node-sdk'

interface TemplateMessageCustomParameter {
  id: number
  paramName: string
  paramValue: string
  paramOrder: number
  paramType: string
}

interface TemplateMessageButton {
  id: number
  buttonArray: string
}

interface TemplateInfo {
  id: number
  name: string
  categoryId: number
  categoryName: string
  languageId: number
  languageName: string
  templateType: string
  templateBody: string
  templateHeader: string
  templateFooter: string
  templateUuid: string
  status: string
  buttonsType: string
  type: string
  createdAt: string
  updatedAt: string
  projectId: number
  template_message_custom_parameters: TemplateMessageCustomParameter[]
  template_message_buttons: TemplateMessageButton[]
}

const handler = async (event: { req: Request; res: Response }): Promise<void> => {
  const { req, res } = event

  const { prisma, healthCheck, getBody, sendResponse, validateBody, authenticateUser } = await shared.getShared()

  try {
    // health check
    if (healthCheck(req, res)) return
    const reqBody = await getBody(req)

    //await validateBody(reqBody, 'getTemplateDetails')

    // const userInfo = await authenticateUser(req)

    // if (userInfo.error) {
    //   sendResponse(res, 400, { success: false, msg: userInfo.error })
    //   return
    // }

    const templateInfo: TemplateInfo[] = await prisma.$queryRaw<TemplateInfo[]>`
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
          (SELECT   json_agg(json_build_object('id', tmcp.id, 'paramName', tmcp."param_name",'param_value',tmcp."param_value",
           'paramOrder',tmcp."param_order",'paramType',tmcp."param_type")) 
            FROM template_message_custom_parameters tmcp
            WHERE  t.id = tmcp.template_message_id AND tmcp.id IS NOT NULL )AS template_message_custom_params,
            t."project_id",
            (SELECT   json_agg(json_build_object('id', tmb.id, 'buttonArray', tmb."button_array"))
            FROM template_message_buttons tmb
            WHERE  t.id = tmb.template_message_id AND tmb.id IS NOT NULL ) AS template_message_buttons    
      FROM templates as t
      LEFT JOIN template_message_buttons as tmb ON t.id = tmb.template_message_id
      LEFT JOIN template_message_custom_parameters as tmcp ON t.id = tmcp.template_message_id
      WHERE t.project_id =${reqBody.project_id}
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
          t.project_id`

    sendResponse(res, 200, { success: true, msg: `template retrived successfully`, data: templateInfo })
  } catch (error) {
    console.error('Error retriving templates:', error)
  }
}

export default handler
