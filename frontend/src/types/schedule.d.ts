export interface Schedule {
  id: number
  first_name: string
  last_name: string
  job_type: string
  qualifications: string
  department_id: number
  salary: string
  deleted: boolean
  created_at: string
  updated_at: string
  appointmentId: number
  purpose: string
  start_time: string
  end_time: string
}

export type ScheduleResponse = {
  queryResult: {
    count: number
  }
  data: Schedule[]
}

export interface DoctorSchedule {
  id: number
  patient_id: number
  staff_id: number
  start_time: string
  end_time: string
  purpose: string
  deleted: boolean
  created_at: string
  updated_at: string
}

export type DoctorScheduleResponse = {
  queryResult: {
    count: number
  }
  data: DoctorSchedule[]
}
