import { TFinesAccHistoryAndNotesFilterCategoryMap } from './fines-acc-history-and-notes-filter-category-map.type';

export type TFinesAccHistoryAndNotesFilterCategory<
  TKeys extends keyof TFinesAccHistoryAndNotesFilterCategoryMap = keyof TFinesAccHistoryAndNotesFilterCategoryMap,
> = Pick<TFinesAccHistoryAndNotesFilterCategoryMap, TKeys>[TKeys];
