export interface IComponentProperties {
  accountId: String | `${number}`;
  fragments:
    | 'at-a-glance'
    | 'defendant'
    | 'parent-or-guardian'
    | 'payment-terms'
    | 'enforcement'
    | 'impositions'
    | 'history-and-notes'
    | undefined;
  interceptedRoutes: string[];
}
