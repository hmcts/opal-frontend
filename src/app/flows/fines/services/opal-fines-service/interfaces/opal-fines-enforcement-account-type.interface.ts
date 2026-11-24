export interface IOpalFinesEnforcementAccountType {
  id: number;
  version: number;
  minimum_balance?: number | null;
  account_type: 'COL' | 'A' | 'CO' | 'Y' | 'CFP';
  enforcement_account_type: 'COLL' | 'COLH' | 'AL' | 'AH' | 'COL' | 'COH' | 'YL' | 'YH' | 'CFPL' | 'CFPH';
  path: 'L' | 'H';
}
