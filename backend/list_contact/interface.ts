export interface RequesBody {
  page_number: number
  limit: number
  search: string
  project_id:string
}

export interface UserInfo {
  error?: string
  id: string
}
