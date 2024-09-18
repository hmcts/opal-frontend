import { IOpalFinesDefendantAccountNote } from '../interfaces/opal-fines-defendant-account-note.interface';

export const OPAL_FINES_DEFENDANT_ACCOUNT_NOTES_MOCK: IOpalFinesDefendantAccountNote[] = [
  {
    associated_record_type: 'defendant_accounts',
    associated_record_id: 'rec666',
    business_unit_id: 1,
    note_id: 341,
    note_text: 'A cat in a hat sat on a mat',
    note_type: 'AA',
    posted_by: 'test_user',
    posted_by_user_id: 1,
    posted_date: '2024-02-01 09:13:07',
  },
  {
    associated_record_type: 'defendant_accounts',
    associated_record_id: 'rec666',
    business_unit_id: 1,
    note_id: 321,
    note_text: 'A cat in a hat sat on a mat',
    note_type: 'AA',
    posted_by: 'test_user',
    posted_by_user_id: 1,
    posted_date: '2024-01-31 15:30:37',
  },
];
