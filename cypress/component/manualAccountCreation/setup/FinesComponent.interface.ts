export interface IFinesComponentProperties {
  draftAccountId: String | `${number}`;
  fragments: 'in-review' | 'to-review' | 'rejected' | 'failed' | 'approved' | 'deleted' | undefined;
  componentUrl: string;
  interceptedRoutes: string[];
  isCheckerUser: boolean | false;
}
