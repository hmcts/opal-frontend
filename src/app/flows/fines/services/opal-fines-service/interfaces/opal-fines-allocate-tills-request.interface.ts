export interface IOpalFinesAllocateTillsRequest {
  tills: { till_id: number; business_unit_id: number }[];
}
