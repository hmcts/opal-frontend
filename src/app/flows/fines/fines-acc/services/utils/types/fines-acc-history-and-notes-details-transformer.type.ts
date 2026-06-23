import { IFinesAccHistoryAndNotesDetails } from '../interfaces/fines-acc-history-and-notes-details.interface';
import { TFinesAccHistoryAndNotesRawItem } from './fines-acc-history-and-notes-raw-item.type';

export type TFinesAccHistoryAndNotesDetailsTransformer = (
  item: TFinesAccHistoryAndNotesRawItem,
) => IFinesAccHistoryAndNotesDetails;
