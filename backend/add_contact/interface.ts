export interface RequesBody {
    name: string
    country_code: string
    phone_number: string
    project_id: string
    email: string
    address?: string
    id?:string,
    registered_user: boolean
  }
  
  export interface UserInfo {
    error?: string
    id:string
  }
  