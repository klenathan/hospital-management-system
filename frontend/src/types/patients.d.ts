export interface Patient {
  id: number
  first_name: string
  last_name: string
  date_of_birth: string
  contact_info: string
  address: string
  allergies: string
  deleted: boolean
  created_at: string
  updated_at: null
}

export type PatientResponse = {
  queryResult: {
    count: number
  }
  data: Patient[]
}
