export interface IFinesApiSelectableTableContent {
  id: string;
  caption: string;
  selectAllId: string;
  selectAllGroupId?: string;
  selectColumnId?: string;
  selectAll: string;
  selectColumn?: string;
  selectionLegend: string;
  headingId?: string;
  descriptionId: string;
  selectedCountId: string;
  selectionCellSuffix: string;
  announcement?: string;
  announcementId?: string;
  paginationId?: string;
  selected: (count: number, total: number) => string;
}
