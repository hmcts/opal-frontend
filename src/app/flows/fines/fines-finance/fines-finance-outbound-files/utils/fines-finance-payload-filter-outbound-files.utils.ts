import type { IOpalFileHandlingInterfaceFile } from '@hmcts/opal-frontend-common/services/opal-file-handling-service/interfaces';

/**
 * Applies an outbound business-unit selection while retaining files without a unit.
 * @param files - Metadata returned for the outbound scope and selected dates.
 * @param businessUnit - Selected business-unit code, or no selection.
 * @returns Matching files and files without a business-unit code, in API order.
 */
export function filterOutboundFilesByBusinessUnit(
  files: IOpalFileHandlingInterfaceFile[] | null | undefined,
  businessUnit: string | null,
): IOpalFileHandlingInterfaceFile[] {
  return (
    files?.filter(
      (file) => !businessUnit || !file.business_unit_codes?.length || file.business_unit_codes.includes(businessUnit),
    ) ?? []
  );
}
