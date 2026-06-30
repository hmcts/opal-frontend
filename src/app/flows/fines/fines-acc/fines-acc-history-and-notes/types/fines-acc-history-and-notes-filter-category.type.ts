export type TFinesAccHistoryAndNotesFilterCategoryMap = {
  amendments: 'amendments';
  enforcements: 'enforcements';
  financial: 'financial';
  notes: 'notes';
  paymentTerms: 'paymentTerms';
};

export type TFinesAccHistoryAndNotesFilterCategory<
  TKeys extends keyof TFinesAccHistoryAndNotesFilterCategoryMap = keyof TFinesAccHistoryAndNotesFilterCategoryMap,
> = Pick<TFinesAccHistoryAndNotesFilterCategoryMap, TKeys>[TKeys];
