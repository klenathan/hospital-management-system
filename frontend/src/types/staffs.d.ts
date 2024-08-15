export interface StaffMember {
  id: number
  first_name: string
  last_name: string
  job_type: string
  qualifications: string
  department_id: number
  salary: string
  deleted: number
  created_at: string
  updated_at: string
}

export interface Department {
  id: number
  name: string
}
