export interface IOpalFinesProcessInterfaceJob {
  business_unit_id: number;
  interface_job_id: number;
  override_inhibits: boolean;
}

export interface IOpalFinesProcessInterfaceJobsPayload {
  interface_jobs: IOpalFinesProcessInterfaceJob[];
}
