export interface IFinesReportsDefinition {
  id: string;
  heading: string;
  title: string;
  permissionIds: readonly number[];
  operationalLinkId?: string;
  highlightLinkId?: string;
  highlightLinkText?: string;
}
