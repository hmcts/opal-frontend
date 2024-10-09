export interface IOpalFinesMajorCreditor {
  business_unit_id: number;
  major_creditor_code: string;
  major_creditor_id: number;
  name: string;
  postcode: string;
}

export interface IOpalFinesMajorCreditorRefData {
  count: number;
  refData: IOpalFinesMajorCreditor[];
}
