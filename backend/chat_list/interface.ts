export interface RequesBody {
  page_number: number
  limit: number
  search: string,
  project_id : string
}

export interface UserInfo {
  error?: string
  id:string
}


export interface Participants {
  contact_id: string
  name: string
  email: string
}
export interface Chat {
  id: string
  status: string
  latest_message: string
  channel_id: string
  created_at: string
  updated_at: string
  participants: Participants[]
  chat_name?: string
  receiver_id?: string
}
