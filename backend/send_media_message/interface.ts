export interface validatedPhoneNumber {
  phone_number_with_country_code: string
  phone_number_without_country_code: string
}

export interface UserInfo {
  error: string
  id: string
}
export interface CandidateInfo {
  id: string;
  phone_number :string;
  name :string;
}

export interface ChatInfo {
  id: string;
  wa_conversation_id:string;
}
