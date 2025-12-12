import type { ResultReferenceCommon } from './generated/opal-fines-result-reference-common.interface';

export interface IOpalFinesResults extends ResultReferenceCommon {
  active?: boolean;
  imposition_allocation_order?: number | null;
  imposition_creditor?: string | null;
  result_title_cy?: string | null;
  result_type?: string | null;
}

export interface IOpalFinesResultsRefData {
  count: number;
  refData: IOpalFinesResults[];
}
