import { shared } from '@appblocks/node-sdk';
import { nanoid } from 'nanoid';
import moment from 'moment';
import axios from 'axios';
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
    validatePhoneNumber,
    authenticateUser
  } = await shared.getShared();
  try {
    // health check
    if (healthCheck(req, res)) return;
    const reqBody = await getBody(req);
    await validateBody(reqBody, 'newBroadcast');
    const userInfo = await authenticateUser(req);
    if (userInfo.error) {
      sendResponse(res, 400, {
        success: false,
        msg: userInfo.error
      });
      return;
    }
    let actualRecipientIds = [];
    let recipientsHashmap = new Map();
    for (const userId of reqBody.recipients) {
      if (!recipientsHashmap.has(userId)) {
        recipientsHashmap.set(userId, userId);
        actualRecipientIds.push(userId);
      }
    }

    //template info deatils
    const templateInfo = await prisma.$queryRaw`
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
    t.header_url,
    t.template_uuid,
    t.status,
    t.buttons_type,
    t.type,
    t.created_at,
    t.updated_at,
    t.project_id,
    tmb.id AS buttonId,
    tmb.template_message_id AS buttonTemplateMessageId,
    tmb.button_array,
    tmcp.id AS paramId,
    tmcp.template_message_id AS paramTemplateMessageId,
    tmcp.param_name,
    tmcp.param_value,
    tmcp.param_order,
    tmcp.param_type
  FROM templates as t
  LEFT JOIN template_message_buttons as tmb ON t.id = tmb.template_message_id
  LEFT JOIN template_message_custom_parameters as tmcp ON t.id = tmcp.template_message_id
  WHERE t.id = ${reqBody.templateId}

`;
    await prisma.$transaction(async prisma => {
      const newBroadcast = await prisma.broadcasts.create({
        data: {
          template_message_id: reqBody.templateId,
          name: reqBody.name,
          broadcast_time: moment.utc(new Date()).toString(),
          success_count: 0,
          failed_count: 0,
          total_number_of_receipients: actualRecipientIds.length,
          status: 'succeeded',
          created_by: userInfo?.id,
          broadcast_template_params: reqBody?.template_params,
          project_id: reqBody.project_id,
          total_remaining_recipients_count: actualRecipientIds.length
        }
      });
      for (const recipient of actualRecipientIds) {
        //Initialisations
        let failCheck = false;
        let createNewUser = false;
        let existingUserId = null;
        let chatExists = false;
        let searchExistCandidate = null;
        const projectInfo = await prisma.$queryRaw`select * from projects where id= ${reqBody.project_id}`;
        const candidateInfo = await prisma.$queryRaw`select * from contacts as c where c.id =${recipient}`;
        const item = await prisma.$queryRaw`
        select c.chat_id from participants as c
        where c.contact_id =${candidateInfo[0]?.id}`;
        const chatInfo = await prisma.$queryRaw`select * from chats as c where c.id =${item[0]?.chat_id}`;
        if (chatInfo.length > 0) {
          chatExists = true;
        }
        const getValidatedPhoneNumber = await validatePhoneNumber(candidateInfo[0].phone_number, candidateInfo[0].country_code);
        let whatsappAvailability = 'true';
        let headerUrl = projectInfo?.[0]?.header_url;
        let errorLogMessage = null;
        let newChat = {};
        let name = '';
        if (candidateInfo[0]?.name?.replace(/^\s+|\s+$/gm, '') === '') {
          name = getValidatedPhoneNumber.phone_number_with_country_code;
        } else {
          name = candidateInfo[0]?.name;
        }
        const generatedWaConversationId = nanoid();

        //Template structuring procedure starts here
        let messageStructure = ``;
        let headerParameters = [];
        let bodyParameters = [];
        let footerParameters = [];
        let components = [];
        let paramArray = [];
        let urlChecker = false;

        //parameter structure here
        if (newBroadcast) {
          for (const param of newBroadcast.broadcast_template_params) {
            if (param.name === 'url') {
              urlChecker = true;
              headerUrl = param.value;
            }
            paramArray.push({
              name: param.name,
              value: param.value
            });
          }
          paramArray = [...paramArray];
        }
        if (templateInfo[0].templateHeader) {
          let headerText = '';
          if (templateInfo[0].templateHeader.format === 'TEXT') {
            headerText = templateInfo[0].templateHeader.text;

            // eslint-disable-next-line no-useless-escape
            const pattern = /[^{\{]+(?=}\})/g;
            let extractedHeaderParams = headerText.match(pattern);
            if (extractedHeaderParams) {
              for (const templateParam of extractedHeaderParams) {
                for (const candidateParam of paramArray) {
                  if (templateParam === candidateParam.name) {
                    let headerParamObject = {
                      type: 'text',
                      text: candidateParam.value
                    };
                    headerParameters.push(headerParamObject);
                    headerText = headerText.replaceAll(`{{${candidateParam.name}}}`, `${candidateParam.value}`);
                  }
                }
              }
              const key = 'text';
              headerParameters = [...new Map(headerParameters.map(item => [item[key], item])).values()];
              if (extractedHeaderParams.length != headerParameters.length) {
                return sendResponse(res, 500, {
                  message: 'Insufficient Candidate Parameters'
                });
              }
            }
            messageStructure = `${headerText}`;
          }
          if (templateInfo[0].templateHeader.format === 'IMAGE') {
            if (urlChecker === false) {
              headerUrl = templateInfo[0].templateHeader?.url;
            }
            let imageObject = {
              type: 'image',
              image: {
                link: headerUrl
              }
            };
            headerParameters.push(imageObject);
          }
          if (templateInfo[0].templateHeader?.format === 'VIDEO') {
            let videoObject = {
              type: 'video',
              video: {
                link: templateInfo[0].templateHeader?.url
              }
            };
            headerParameters.push(videoObject);
          }
          if (templateInfo[0].templateHeader?.format === 'DOCUMENT') {
            let documentObject = {
              type: 'document',
              document: {
                link: templateInfo[0].templateHeader?.url
              }
            };
            headerParameters.push(documentObject);
          }
          if (headerParameters.length > 0) {
            components.push({
              type: 'header',
              parameters: headerParameters
            });
          }
        }
        if (templateInfo[0]?.templateBody) {
          let bodyText = templateInfo[0].templateBody.text;

          // eslint-disable-next-line no-useless-escape
          const pattern = /[^{\{]+(?=}\})/g;
          let extractedBodyParams = bodyText.match(pattern);
          if (extractedBodyParams) {
            for (const templateParam of extractedBodyParams) {
              for (const candidateParam of paramArray) {
                if (templateParam.toLowerCase() === candidateParam.name.toLowerCase()) {
                  let bodyParamObject = {
                    type: 'text',
                    text: candidateParam.value
                  };
                  bodyParameters.push(bodyParamObject);
                  bodyText = bodyText.replaceAll(`{{${templateParam}}}`, `${candidateParam.value}`);
                  break;
                }
              }
            }
            if (extractedBodyParams.length != bodyParameters.length) {
              failCheck = true;
            }
            const key = 'text';
            bodyParameters = [...new Map(bodyParameters.map(item => [item[key], item])).values()];
            components.push({
              type: 'body',
              parameters: bodyParameters
            });
          }
          if (messageStructure != ``) {
            messageStructure = `${messageStructure}
                      
          ${bodyText}`;
          } else {
            messageStructure = `${bodyText}`;
          }
        }
        if (templateInfo[0]?.templateFooter) {
          let footerText = templateInfo[0]?.templateFooter.text;

          // eslint-disable-next-line no-useless-escape
          const pattern = /[^{\{]+(?=}\})/g;
          let extractedFooterParams = footerText.match(pattern);
          if (extractedFooterParams) {
            for (const templateParam of extractedFooterParams) {
              for (const candidateParam of paramArray) {
                if (templateParam.toLowerCase() === candidateParam.name.toLowerCase()) {
                  let footerParamObject = {
                    type: 'text',
                    text: candidateParam.value
                  };
                  footerParameters.push(footerParamObject);
                  footerText = footerText.replaceAll(`{{${templateParam}}}`, `${candidateParam.value}`);
                }
              }
            }
            if (extractedFooterParams.length != footerParameters.length) {
              failCheck = true;
              //console.log("failCheck6", failCheck);
            }
            components.push({
              type: 'footer',
              parameters: footerParameters
            });
          }
          if (messageStructure != ``) {
            messageStructure = `${messageStructure}
                
          ${footerText}`;
          } else {
            messageStructure = `${footerText}`;
          }
        }
        if (templateInfo[0]?.buttonsType) {
          let templateButtons = templateInfo[0]?.buttonArray;
          let buttonCounter = 1;
          if (templateButtons || templateButtons?.length > 0) {
            for (const button of templateButtons) {
              if (messageStructure != `` && buttonCounter === 1) {
                messageStructure = `${messageStructure}
            
              ${buttonCounter}) ${button.text}`;
              } else if (messageStructure != `` && buttonCounter != 1) {
                messageStructure = `${messageStructure}
              ${buttonCounter}) ${button.text}`;
              } else {
                messageStructure = `${buttonCounter}) ${button.text}`;
              }
              buttonCounter++;
            }
          }
        }
        const projectDetails = await prisma.projects.findFirst({
          where: {
            id: reqBody.project_id
          }
        });
        const vendorDetails = await prisma.api_vendor.findFirst();
        const auth_config = {
          headers: {
            Authorization: `Bearer ${projectDetails?.whatsapp_business_token}`,
            'Content-Type': 'application/json'
          }
        };
        const baseURL = vendorDetails.vendor_base_url;
        const phoneNumber_id = projectDetails.whatsapp_phone_number_id;
        const api_version = vendorDetails.vendor_api_version;
        let message = null;
        message = await axios.post(`${baseURL}${api_version}/${phoneNumber_id}/messages`, {
          messaging_product: 'whatsapp',
          to: `${getValidatedPhoneNumber.phone_number_with_country_code}`,
          type: 'template',
          template: {
            name: templateInfo[0].name,
            language: {
              code: templateInfo[0].language_name
            },
            components: components
          }
        }, auth_config).then(result => {
          return result;
        }).catch(error => {
          return error;
        });
        console.log('message', message);
        if (message?.response?.status === 404) {
          sendResponse(res, 404, {
            message: message?.response?.data?.error?.error_data?.details
          });
          throw new Error(message?.response?.data?.error?.error_data?.details);
        }
        if (message?.response?.data?.error?.code === 100) {
          errorLogMessage = message?.response?.data?.error;
          whatsappAvailability = 'false';
          failCheck = true;
        } else if (message?.data?.messages?.[0]?.id) {
          whatsappAvailability = 'true';
        }
        if (!chatExists) {
          newChat = await prisma.chats.create({
            data: {
              chat_name: name,
              status: 'open',
              initiated_by: userInfo?.id,
              wa_conversation_id: generatedWaConversationId,
              is_candidate_replied: false,
              latest_message: messageStructure,
              latest_message_created_time: new Date().toISOString(),
              last_message_type: templateInfo[0]?.type,
              last_send_template_id: reqBody.templateId,
              whatsapp_availability: whatsappAvailability,
              project_id: reqBody.project_id
            }
          });
          if (message?.data?.messages?.[0]?.id) {
            await prisma.chat_template.create({
              data: {
                template_id: reqBody?.templateId,
                chat_id: newChat?.id
              }
            });
          }
          await prisma.participants.create({
            data: {
              contact_id: candidateInfo[0].id,
              chat_id: newChat?.id
            }
          });

          //Update Chat last send message details
          await prisma.chats.update({
            data: {
              latest_message: messageStructure,
              latest_mssage_created_time: new Date().toISOString(),
              receiver_id: candidateInfo[0]?.id,
              last_message_type: 'text'
            },
            where: {
              id: newChat?.id
            }
          });
          const bulkMessageData = [{
            chat_id: newChat.id,
            message_text: messageStructure,
            is_message_read: false,
            message_type: 'text',
            template_message_id: templateInfo[0]?.id,
            whatsapp_message_id: message?.data?.messages?.[0]?.id,
            event_type: 'template',
            time_stamp: new Date().toISOString(),
            sender_id: userInfo?.id,
            receiver_id: candidateInfo[0]?.id,
            status: 'active'
          }];
          await prisma.individual_chat_details.createMany({
            data: bulkMessageData
          });
          await prisma.broadcast_recipients.create({
            data: {
              broadcast_id: newBroadcast.id,
              user_id: candidateInfo[0]?.id,
              recieved_status: 'success',
              broadcast_message_uid: message?.data?.messages?.[0]?.id
            }
          });
        } else {
          const updateChatStatus = await prisma.chats.update({
            data: {
              status: 'open',
              initiated_by: userInfo?.id,
              latest_message: messageStructure,
              latest_message_created_time: new Date().toISOString(),
              last_message_type: 'text',
              last_send_template_id: templateInfo[0]?.id,
              whatsapp_availability: 'true',
              is_contact_replied: true
            },
            where: {
              id: chatInfo[0].id
            }
          });
          const bulkData = [{
            chat_id: updateChatStatus?.id,
            message_text: messageStructure,
            whatsapp_message_id: message?.data?.messages?.[0]?.id,
            is_message_read: false,
            message_type: 'text',
            event_type: 'template',
            sender_id: userInfo?.id,
            receiver_id: candidateInfo[0].id,
            status: 'active',
            time_stamp: new Date().toISOString()
          }];
          await prisma.individual_chat_details.createMany({
            data: bulkData
          });
          await prisma.broadcast_recipients.create({
            data: {
              broadcast_id: newBroadcast?.id,
              user_id: candidateInfo[0]?.id,
              recieved_status: 'success',
              broadcast_message_uid: message?.data?.messages?.[0]?.id
            }
          });
        }
      }
    });
    sendResponse(res, 200, {
      success: true,
      msg: `broadcast send successfully`
    });
  } catch (error) {
    console.error('Error sending broadcast:', error);
  }
};
export default handler;
