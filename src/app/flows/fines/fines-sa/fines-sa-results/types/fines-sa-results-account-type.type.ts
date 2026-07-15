import { FINES_SA_RESULTS_ACCOUNT_TYPE } from '../constants/accountType.constant';

export type FinesSaResultsAccountType =
  (typeof FINES_SA_RESULTS_ACCOUNT_TYPE)[keyof typeof FINES_SA_RESULTS_ACCOUNT_TYPE];
