export const FINES_MCI_CREATE_ALLOCATE_TABLE_CONTENT = {
  selectedTills: (selectedTills: number, totalTills: number): string => `${selectedTills} of ${totalTills} selected`,
  caption: 'Tills available to allocate',
  selectColumn: 'Select tills to allocate',
  selectAll: 'Select all tills',
  selectTill: (tillNumber: string): string => `Select till ${tillNumber}`,
  columns: {
    tillNumber: 'Till number',
    payments: 'Payments',
    amount: 'Amount',
    businessUnit: 'Business unit',
    createdBy: 'Created by',
    dateCreated: 'Date created',
  },
} as const;
