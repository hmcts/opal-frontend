export const FINES_ACCOUNT_ROUTE_TYPES = {
  defendant: 'defendant',
  minorCreditor: 'minor-creditor',
  majorCreditor: 'major-creditor',
} as const;

export type FinesAccRouteType = (typeof FINES_ACCOUNT_ROUTE_TYPES)[keyof typeof FINES_ACCOUNT_ROUTE_TYPES];
