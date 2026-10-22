import { IOpalFinesSuspenseItemHistoryEntry } from '../interfaces/opal-fines-suspense-item-history-entry.interface';

export const OPAL_FINES_SUSPENSE_ITEM_HISTORY_MOCK: IOpalFinesSuspenseItemHistoryEntry[] = [
  {
    posted_date: '2026-10-21',
    description: 'Local development note',
    amount: null,
    balance: null,
    notes: 'Synthetic example while the suspense endpoints are unavailable.',
  },
  {
    posted_date: '2026-10-20',
    description: 'Local development receipt',
    amount: 125.5,
    balance: 125.5,
    notes: null,
  },
];
