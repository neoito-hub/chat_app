

export interface UserInfo {
  error?: string
  id:string
}

export interface VendorDetails {
  vendor_base_url: string
  vendor_api_version: string
}


export interface ProjectDetails {
  id: string
  whatsapp_business_token: string
  whatsapp_phone_number_id : string
}
