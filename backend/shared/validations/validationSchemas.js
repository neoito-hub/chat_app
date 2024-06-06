import vine from '@vinejs/vine';
const addContactSchema = vine.object({
  name: vine.string(),
  country_code: vine.string().startsWith('+91'),
  project_id: vine.string(),
  phone_number: vine.string(),
  email: vine.string(),
  address: vine.string(),
  registered_user: vine.boolean(),
  id: vine.string().optional()
});
const chatHistorySchema = vine.object({
  chat_id: vine.string(),
  page_number: vine.number(),
  limit: vine.number()
});
const chatListSchema = vine.object({
  page_number: vine.number(),
  limit: vine.number(),
  search: vine.string(),
  project_id: vine.string()
});
const listContactSchema = vine.object({
  page_number: vine.number(),
  limit: vine.number(),
  search: vine.string().nullable().optional(),
  project_id: vine.string()
});
const createTemplateSchema = vine.object({
  name: vine.string(),
  type: vine.string(),
  categoryId: vine.string(),
  buttonType: vine.string().optional(),
  projectId: vine.string(),
  category: vine.string(),
  language: vine.string(),
  languageId: vine.string(),
  components: vine.array(vine.object({}))
});
const sendTemplateSchema = vine.object({
  candidate_details: vine.object({}),
  template_message_id: vine.string(),
  project_id: vine.string(),
  template_params: vine.array(vine.object({}))
});
const sendtextMessageSchema = vine.object({
  contact_id: vine.string(),
  message: vine.string(),
  project_id: vine.string()
});
const newBroadcast = vine.object({
  name: vine.string(),
  templateId: vine.string(),
  recipients: vine.array(vine.string()),
  template_params: vine.array(vine.object({})),
  project_id: vine.string()
});
const paginationAndSearchSchema = vine.object({
  page_number: vine.number(),
  limit: vine.number(),
  search: vine.string(),
  project_id: vine.string()
});
export default {
  addContactSchema,
  chatHistorySchema,
  chatListSchema,
  listContactSchema,
  createTemplateSchema,
  sendTemplateSchema,
  sendtextMessageSchema,
  newBroadcast,
  paginationAndSearchSchema
};
