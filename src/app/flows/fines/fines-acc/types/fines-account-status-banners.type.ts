import { FinesAccAccountStatusCodes } from '../interfaces/fines-acc-account-status-codes.interface';
import { FinesAccountStatusBanner } from '../interfaces/fines-account-status-banner.interface';

export type FinesAccountStatusBanners = Partial<{
  [key in keyof FinesAccAccountStatusCodes]: FinesAccountStatusBanner;
}>;
