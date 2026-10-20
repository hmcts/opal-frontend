export type TOpalFinesTillStatus = 'CREATED' | 'PROCESSING' | 'FAILED' | 'ALLOCATED';

export interface IOpalFinesTillsParams {
  statuses: TOpalFinesTillStatus[];
  auto_payments: boolean;
}
