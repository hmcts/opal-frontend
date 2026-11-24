/** Processing messages are grouped by backend section key; payload fields depend on that key. */
export interface IOpalFinesProcessedFileSummaryResponse {
  file_name: string;
  source: string;
  business_unit_name: string;
  till_number?: number | null;
  total_amount: number | string;
  total_records: number;
  total_errors: number;
  interface_messages: {
    message_text: string;
    messages: {
      interface_messages_id: number | string;
      message_type: 'Exception' | 'Error' | 'Warning' | 'Info';
      message_data: Record<string, unknown>;
    }[];
  }[];
}
