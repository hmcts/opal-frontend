export interface IComponentProperties {
  accountId: `${number}`;
  fragments:
    | 'at-a-glance'
    | 'defendant'
    | 'payment-terms'
    | 'enforcement'
    | 'impositions'
    | 'history-and-notes'
    | undefined;
  interceptedRoutes: string[];
}
