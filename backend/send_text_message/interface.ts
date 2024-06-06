export interface validatedPhoneNumber {
  phone_number_with_country_code: string
  phone_number_without_country_code: string
}

export interface RequestBody {
  contact_id: string
  project_id: string
  message: string
}

export interface UserInfo {
  error: string
  id: string;
}

export interface ProjectDetails {
  id: string
  whatsapp_business_token: string
  whatsapp_phone_number_id : string
}

export interface CandidateInfo {
  id: string
  phone_number: string
  name:string
}

export interface ChatInfo {
  id: string
  wa_conversation_id: string
}

export interface VendorDetails {
  vendor_base_url: string
  vendor_api_version: string
}

export interface MessageDataCloudApi {
  messaging_product: string
  recipient_type: string
  to: string
  type: string
  text: {
    preview_url: boolean
    body: string
  }
}

export interface Message {
  id: string
  messages:{
    id: string
  }
}
