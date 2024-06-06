export interface validatedPhoneNumber {
  phone_number_with_country_code: string
  phone_number_without_country_code: string
}

export interface RequestBody {
  candidate_details: {
    phone_number: string
    country_code: string
  }
  project_id: string
  template_message_id: string
  template_params: {
    name: string
    value: string
  }[]
}

export interface UserInfo {
  error: string
  id: string
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

export interface CandidateInfo {
  id: string
}

export interface ChatInfo {
  id: string
}
