export interface Appointment {
  patient_first_name?: string
  patient_last_name?: string
  staff_first_name?: string
  staff_last_name?: string
  staff_job_type?: string
  treatment_date?: string
  treatment_details?: string
  id?: number
  first_name?: string
  last_name?: string
  job_type?: string
  qualifications?: string
  department_id?: number
  salary?: string
  deleted?: boolean
  created_at?: string
  updated_at?: string
  busy?: boolean
}

export type AppointmentResponse = {
  queryResult: {
    count: number
  }
  data: Appointment[]
}

export interface WorkingSchedule {
  id: number
  first_name: string
  last_name: string
  job_type: string
  department_id: number
  deleted: boolean
  busy: boolean
}
export type WorkingScheduleResponse = {
  queryResult: {
    count: number
  }
  data: WorkingSchedule[]
}
