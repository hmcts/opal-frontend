import { IOpalFinesSuspenseItemSummary } from '../interfaces/opal-fines-suspense-item-summary.interface';

export const OPAL_FINES_SUSPENSE_ITEM_SUMMARY_MOCK: IOpalFinesSuspenseItemSummary = {
  suspense_item_id: 1001,
  suspense_item_number: '1234',
  business_unit_details: {
    business_unit_id: 22,
    business_unit_name: 'Camden and Islington',
  },
  created_date: '2026-10-20T10:00:00',
  suspense_item_type: {
    item_type: 'UN',
    item_type_display_name: 'Unidentified',
  },
  balance: '125.50',
};
