export interface validatedPhoneNumber {
  phone_number_with_country_code: string
  phone_number_without_country_code: string
}

export interface RequestBody {
  recipients: string[]
  templateId: string
  name: string
  template_params?: any
  project_id: string
}

export interface UserInfo {
  error: string
  id: string
}

export interface ProjectInfo {
  whatsapp_business_token: string
  header_url: string
  whatsapp_phone_number_id: string
}

export interface VendorDetails {
  vendor_api_version: string
  vendor_base_url: string
}

export interface Param {
  name: string
  value: string
}

export interface Header {
  format: string
  text?: string
  url?: string
}

export interface Button {
  text: string
}

export interface TemplateInfo {
  id: string
  name: string
  categoryId: string
  categoryName: string
  languageId: string
  language_name: string
  templateType: string
  templateBody: {
    text?: string
  }
  templateHeader: {
    format?: string
    text?: string
    headerUrl?: string
    url?: string
  }
  templateFooter: {
    text?: string
  }
  header_url: string
  templateUuid: string
  status: string
  buttonsType: string
  type: string
  createdAt: string
  updatedAt: string
  projectId: string
  buttonId: string
  buttonTemplateMessageId: string
  buttonArray: any[]
  paramId: string
  paramTemplateMessageId: string
  paramName: string
  paramValue: string
  paramOrder: string
  paramType: string
}

export interface ChatInfo {
  id: string
  candidateId: string
}

export interface BroadcastRecipient {
  broadcastId: string
  userId: string
  recievedStatus: string
  broadcast_message_uid: string
}
