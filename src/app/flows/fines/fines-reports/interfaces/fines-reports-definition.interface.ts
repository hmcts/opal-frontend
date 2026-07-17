export interface IFinesReportsDefinition {
  id: string;
  heading: string;
  title: string;
  permissionIds: readonly number[];
  operationalLinkId: string | null;
  highlightLinkId: string | null;
  highlightLinkText: string | null;
}
