export interface IOpalFinesProsecutor {
  prosecutor_id: number;
  prosecutor_name: string;
  prosecutor_code: string;
  address_line_1: string | null;
  address_line_2: string | null;
  address_line_3: string | null;
  address_line_4: string | null;
  address_line_5: string | null;
  postcode: string | null;
  end_date: string | null;
}

export interface IOpalFinesProsecutorRefData {
  count: number;
  refData: IOpalFinesProsecutor[];
}
