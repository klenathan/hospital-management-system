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
