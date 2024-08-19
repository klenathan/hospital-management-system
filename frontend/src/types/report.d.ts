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
  id: number
  staff_id: number
  job_type: string
  salary: string
  department_id: number
  deleted: boolean
  created_at: string
  updated_at: string
}

export type StaffJobChangeHistoryResponse = {
  queryResult: {
    count: number
  }
  data: StaffJobChangeHistory[]
}
