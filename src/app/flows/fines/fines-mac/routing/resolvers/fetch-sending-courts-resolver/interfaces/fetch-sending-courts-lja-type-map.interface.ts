import { IFinesAccountTypes } from '@app/flows/fines/interfaces/fines-account-types.interface';
import { IFinesOriginatorTypes } from '@app/flows/fines/interfaces/fines-originator-types.interface';

export type TFetchSendingCourtsOriginatorType = keyof IFinesOriginatorTypes;
export type TFetchSendingCourtsAccountType = keyof IFinesAccountTypes;
export type TFetchSendingCourtsTfoAccountType = Exclude<TFetchSendingCourtsAccountType, 'Conditional Caution'>;

export interface IFetchSendingCourtsLjaTypeMap {
  NEW: Record<TFetchSendingCourtsAccountType, readonly string[]>;
  TFO: Record<TFetchSendingCourtsTfoAccountType, readonly string[]>;
}
