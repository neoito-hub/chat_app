export interface Component {
    type: string
    [key: string]: any
  }
  
 export  interface Button {
    type: string
    [key: string]: any
  }
  
 export  interface Buttonbody {
    format?: string | null
    text?: string | null
    example?: string | null
    type: string
    buttons: Button[]
  }
  
 export interface TemplateRequestBody {
    name: string
    category: string
    language: string
    type: string
    buttonType?: string
    categoryId: string
    languageId: string
    projectId: string
    components: Component[]
    [key: string]: any
  }
  
 export interface UserInfo {
    error?: string
  }
  
 export  interface TemplateCreationResponse {
    id: string | null
    template_uid: string | null
    header_url: string | null
    error: boolean
    error_message: string | null
    data? :{
      id :string
    }
    response? :{
      data?:{
        error? :{
          message?: string
        }
      }
    }
  }
  