export interface PatientTreatment {
  patient_first_name: string
  patient_last_name: string
  staff_first_name: string
  staff_last_name: string
  staff_job_type: string
  treatment_date: string
  treatment_details: string
}

export type PatientTreatmentResponse = {
  queryResult: {
    count: number
  }
  data: PatientTreatment[]
}

export interface StaffJobChangeHistory {
  created_at: string
  deleted: boolean
  department_id: number
  first_name: string
  id: number
  job_type: string
  last_name: string
  qualifications: string
  salary: number
  staff_id: number
  updated_at: string
  username: string
}

export type StaffJobChangeHistoryResponse = {
  queryResult: {
    count: number
    pageNumber: number
    pageSize: number
    totalCount: number
  }
  data: StaffJobChangeHistory[]
}
export interface DoctorWorkHistory {
  first_name: string
  last_name: string
  job_type: string
  appointment_nums: number
  treatment_nums: number
}

export type DoctorWorkHistoryResponse = {
  queryResult: {
    count: number
  }
  data: DoctorWorkHistory[]
}
