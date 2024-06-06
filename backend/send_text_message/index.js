import { shared } from '@appblocks/node-sdk';
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
    authenticateUser
  } = await shared.getShared();
  try {
    // health check
    if (healthCheck(req, res)) return;
    const reqBody = await getBody(req);
    await validateBody(reqBody, 'sendtextMessageSchema');
    const userInfo = await authenticateUser(req);
    if (userInfo.error) {
      sendResponse(res, 400, {
        success: false,
        msg: userInfo.error
      });
      return;
    }
    let contactId = reqBody.contact_id;
    const projectDetails = await prisma.projects.findFirst({
      where: {
        id: reqBody.project_id
      }
    });
    const candidateInfo = await prisma.$queryRaw`select * from contacts as c where c."id" =${contactId} `;
    if (candidateInfo.length < 0) {
      throw Error('Contact not found');
    }
    const item = await prisma.$queryRaw`
    select c.chat_id from participants as c
    where c.contact_id =${candidateInfo[0]?.id}`;
    const chatInfo = await prisma.$queryRaw`select * from chats as c where c.id =${item[0]?.chat_id}`;
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
    const msgDataCloudApi = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: candidateInfo[0]?.phone_number,
      type: 'text',
      text: {
        preview_url: false,
        body: reqBody.message
      }
    };
    let message = await axios.post(`${baseURL}${api_version}/${phoneNumber_id}/messages`, msgDataCloudApi, auth_config);
    await prisma.$transaction(async prisma => {
      await prisma.individual_chat_details.create({
        data: {
          sender_id: userInfo?.id,
          receiver_id: candidateInfo[0].id,
          status: 'active',
          message_text: reqBody.message,
          message_type: 'text',
          chat_id: chatInfo[0].id,
          event_type: 'message',
          time_stamp: new Date().toISOString(),
          wa_id: candidateInfo[0].phone_number,
          whatsapp_message_id: message?.data.messages[0]?.id,
          conversation_id: chatInfo[0].wa_conversation_id,
          sender_name: userInfo?.id,
          message_status_string: 'SENT',
          is_message_read: false
        }
      });
      await prisma.chats.update({
        where: {
          id: chatInfo[0].id
        },
        data: {
          status: 'open',
          latest_message: reqBody.message,
          latest_message_created_time: new Date().toISOString(),
          last_message_type: 'text'
        }
      });
    });
    let responseData = {
      sender_id: userInfo?.id,
      reciever_id: candidateInfo[0].id,
      message: reqBody?.message
    };
    sendResponse(res, 200, {
      success: true,
      msg: `message sent successfully`,
      data: responseData
    });
  } catch (error) {
    console.error('Error sending message:', error);
  }
};
export default handler;
