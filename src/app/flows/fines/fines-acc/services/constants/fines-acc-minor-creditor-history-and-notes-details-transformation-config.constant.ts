import { IHistoryTransformationConfig } from '@hmcts/opal-frontend-common/services/history-transformation-service';
import { FINES_ACC_HISTORY_AND_NOTES_DETAILS_ALIAS_PATH_PREFIXES } from './fines-acc-history-and-notes-details-alias-path-prefixes.constant';
import { FINES_ACC_HISTORY_AND_NOTES_DETAILS_DATE_FORMAT } from './fines-acc-history-and-notes-details-date-format.constant';
import { FINES_ACC_HISTORY_AND_NOTES_DETAILS_EMPTY_VALUES } from './fines-acc-history-and-notes-details-empty-values.constant';
import { FINES_ACC_MINOR_CREDITOR_HISTORY_AND_NOTES_DETAILS_FALLBACK_ALIASES } from './fines-acc-minor-creditor-history-and-notes-details-fallback-aliases.constant';
import { FINES_ACC_MINOR_CREDITOR_HISTORY_AND_NOTES_DETAILS_HISTORY_ITEM_TYPE_ALIASES } from './fines-acc-minor-creditor-history-and-notes-details-history-item-type-aliases.constant';
import { FINES_ACC_MINOR_CREDITOR_HISTORY_AND_NOTES_DETAILS_TRANSFORMERS } from './fines-acc-minor-creditor-history-and-notes-details-transformers.constant';

export const FINES_ACC_MINOR_CREDITOR_HISTORY_AND_NOTES_DETAILS_TRANSFORMATION_CONFIG: IHistoryTransformationConfig = {
  aliasPathPrefixes: FINES_ACC_HISTORY_AND_NOTES_DETAILS_ALIAS_PATH_PREFIXES,
  dateFormat: FINES_ACC_HISTORY_AND_NOTES_DETAILS_DATE_FORMAT,
  emptyValues: FINES_ACC_HISTORY_AND_NOTES_DETAILS_EMPTY_VALUES,
  fallbackAliases: FINES_ACC_MINOR_CREDITOR_HISTORY_AND_NOTES_DETAILS_FALLBACK_ALIASES,
  historyItemTypeAliases: FINES_ACC_MINOR_CREDITOR_HISTORY_AND_NOTES_DETAILS_HISTORY_ITEM_TYPE_ALIASES,
  transformers: FINES_ACC_MINOR_CREDITOR_HISTORY_AND_NOTES_DETAILS_TRANSFORMERS,
};
