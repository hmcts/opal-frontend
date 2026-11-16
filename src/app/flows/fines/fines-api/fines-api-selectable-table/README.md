# Fines API selectable table

The table owns checkbox controls, selection highlighting and announcements, sorting,
and optional pagination. It reuses the common-library sortable table and multi-select
components. Flow wrappers supply columns, presentation and replacement policies.

## Selection

- Supply unique, stable string IDs through `getRowId`.
- `selectedIds` applies external selection silently. User changes emit
  `selectedIdsChange` in supplied row order, regardless of sorting or pagination.
- Without a bound `selectedIds` input, selection is internal to the component.
- Replacement rows retain only IDs still present. This reconciliation is silent;
  a wrapper that persists selection must reconcile and notify its owner itself.
- To clear selection immediately, supply a new empty `selectedIds` array. Do not
  wait for a refresh response.
- Select-all always applies to every supplied row. The component does not cap rows.

Process caps rows at 500, reconciles persisted IDs and emits removals to its flow
store. Allocate keeps selection in its wrapper and supplies an empty selection on
every replacement response and when refresh is requested.

## Presentation

`columns` defines sort keys, cell ID suffixes, numeric alignment and optional display
keys. A `cellTemplate` receives the row as `$implicit` and the column as `column`;
Allocate uses it for links, monetary values and dates. Sorting uses the column key
on the original row, independently of the displayed cell.

Supply `defaultSort` using the column keys. Replacement rows restore that sort.
`pageSize: null` displays all rows; a positive page size enables common-library
pagination, including its focus movement and page announcements.

`content`, `rowLabel`, `getRowDomId` and `getCellId` preserve each flow's wording,
accessible associations and DOM IDs. `selectionErrorId` links the selection
fieldset to validation owned by the parent screen.
