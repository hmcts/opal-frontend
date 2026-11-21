import { IOpalFinesAllocateTillsRequest } from '@services/fines/opal-fines-service/interfaces/opal-fines-allocate-tills-request.interface';
import { IFinesApiAllocateTillsTableWrapperTableData } from '../../fines-api-process-allocate/fines-api-allocate-tab/fines-api-allocate-tills-table-wrapper/interfaces/fines-api-allocate-tills-table-wrapper-table-data.interface';

/**
 * Maps a complete selection to authoritative till and business-unit identifiers.
 * @param rows Currently displayed tills, including their business-unit identity.
 * @param selectedIds Internal till IDs selected by the user.
 * @returns One batch request, or null when the selection cannot be submitted safely.
 */
export const mapAllocateRequest = (
  rows: readonly IFinesApiAllocateTillsTableWrapperTableData[],
  selectedIds: readonly string[],
): IOpalFinesAllocateTillsRequest | null => {
  const ids = [...new Set(selectedIds)];
  if (ids.length === 0) return null;

  const rowsById = new Map(rows.map((row) => [row.tillId, row]));
  if (rowsById.size !== rows.length) return null;

  const tills: IOpalFinesAllocateTillsRequest['tills'] = [];
  for (const id of ids) {
    const row = rowsById.get(id);
    if (!row) return null;
    const tillId = Number(id);
    if (
      !/^\d+$/.test(id) ||
      !Number.isSafeInteger(tillId) ||
      tillId < 0 ||
      !Number.isInteger(row.businessUnitId) ||
      row.businessUnitId < 0 ||
      row.businessUnitId > 32767
    ) {
      return null;
    }
    tills.push({ till_id: tillId, business_unit_id: row.businessUnitId });
  }
  return { tills };
};
