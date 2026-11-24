import { IOpalFinesProcessedFileSummaryResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-processed-file-summary-response.interface';

export const summaryResponse = (): IOpalFinesProcessedFileSummaryResponse => ({
  file_name: 'synthetic.dat',
  source: ' TEST ',
  business_unit_name: 'Test unit',
  till_number: 42,
  total_amount: '60.00',
  total_records: 6,
  total_errors: 4,
  interface_messages: [
    ...[
      ['records_read', 6, 60],
      ['records_fines', 2, 20],
      ['records_suspense', 3, 30],
      ['records_ignored_rejected', 1, 10],
      ['records_accepted', 5, 50],
    ].map(([key, number, value], index) => ({
      message_text: String(key),
      messages: [{ interface_messages_id: index, message_type: 'Info' as const, message_data: { number, value } }],
    })),
  ],
});
