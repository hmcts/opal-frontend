export interface IComponentProperties {
  accountId: string | `${number}`;
  fragments:
    | 'at-a-glance'
    | 'defendant'
    | 'parent-or-guardian'
    | 'payment-terms'
    | 'enforcement'
    | 'impositions'
    | 'history-and-notes'
    | 'fixed-penalty'
    | 'payment-terms'
    | undefined;
  interceptedRoutes: string[];
}
