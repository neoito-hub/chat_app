export interface RequestBody {
    page?: number
    limit?: number
    search?: string
    project_id: string
  }


export interface UserInfo {
  error?: string
  id: string
}
