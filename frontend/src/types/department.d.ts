export interface Department {
  id: number
  name: string
  deleted: boolean
  created_at: string
  updated_at: string | null
}

export type DepartmentResponse = {
  queryResult: {
    count: number
  }
  data: Department[]
}
