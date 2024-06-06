export interface MessageContent {
  message: string
  [key: string]: any 
}

export interface MessageSender {
  sendMessage(content: MessageContent): void
}


export interface UserDetails {
  user_id?: string
}