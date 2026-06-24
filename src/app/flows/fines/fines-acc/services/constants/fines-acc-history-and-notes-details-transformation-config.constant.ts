import {
  HISTORY_DETAILS_DEFAULT_ALIAS_PATH_PREFIXES,
  HISTORY_DETAILS_DEFAULT_DATE_FORMAT,
  HISTORY_DETAILS_DEFAULT_EMPTY_VALUES,
  IHistoryTransformationConfig,
} from '@hmcts/opal-frontend-common/services/history-transformation-service';
import { FINES_ACC_HISTORY_AND_NOTES_DETAILS_FALLBACK_ALIASES } from './fines-acc-history-and-notes-details-fallback-aliases.constant';
import { FINES_ACC_HISTORY_AND_NOTES_DETAILS_HISTORY_ITEM_TYPE_ALIASES } from './fines-acc-history-and-notes-details-history-item-type-aliases.constant';
import { FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSFORMERS } from './fines-acc-history-and-notes-details-transformers.constant';

export const FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSFORMATION_CONFIG: IHistoryTransformationConfig = {
  aliasPathPrefixes: HISTORY_DETAILS_DEFAULT_ALIAS_PATH_PREFIXES,
  dateFormat: HISTORY_DETAILS_DEFAULT_DATE_FORMAT,
  emptyValues: HISTORY_DETAILS_DEFAULT_EMPTY_VALUES,
  fallbackAliases: FINES_ACC_HISTORY_AND_NOTES_DETAILS_FALLBACK_ALIASES,
  historyItemTypeAliases: FINES_ACC_HISTORY_AND_NOTES_DETAILS_HISTORY_ITEM_TYPE_ALIASES,
  transformers: FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSFORMERS,
};
