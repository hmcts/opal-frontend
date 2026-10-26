export const MANUAL_CASH_INPUT_TILLS_MOCK = {
  tills: [
    {
      till_id: 1001,
      till_number: 9001,
      payment_count: 3,
      amount: 125.5,
      business_unit_name: 'Camden and Islington',
      processed_by: 'Alex Smith',
      date_processed: '2026-01-10T13:30:00.000Z',
    },
    {
      till_id: 1002,
      till_number: 9002,
      payment_count: 1,
      amount: 10,
      business_unit_name: 'Westminster - North',
      processed_by: 'Sam Jones',
      date_processed: '2026-01-09T09:05:00.000Z',
    },
  ],
} as const;
