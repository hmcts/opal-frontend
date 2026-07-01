export interface IFinesReportsDefinition {
  id: string;
  heading: string;
  title: string;
  permissionIds: number[];
  operationalLinkId?: string;
  highlightLinkId?: string;
  highlightLinkText?: string;
}
