import { inject, Injectable } from '@angular/core';
import type { IAlphagovAccessibleAutocompleteItem } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete/interfaces';
import type { ICustomFileInterfaceViewerInboundTableWrapperTableData } from '@hmcts/opal-frontend-common/components/custom/custom-file-interface-viewer/custom-inbound-file-viewer';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import type {
  IOpalFileHandlingInterfaceFile,
  IOpalFileHandlingInterfaceFileParams,
} from '@hmcts/opal-frontend-common/services/opal-file-handling-service/interfaces';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import type { IOpalFinesBusinessUnit } from '../../services/opal-fines-service/interfaces/opal-fines-business-unit.interface';
import { FINES_FINANCE_INBOUND_FILES_SOURCE_OPTIONS } from '../constants/fines-finance-inbound-files-source-options.constant';
import { FINES_FINANCE_INBOUND_FILES_TYPE_OPTIONS } from '../constants/fines-finance-inbound-files-type-options.constant';
import type { IFinesFinanceInboundFilesForm } from './interfaces/fines-finance-inbound-files-form.interface';
import { buildInboundFilesSearchParams } from './utils/fines-finance-payload-build-inbound-files-search.utils';
import {
  getPermittedBusinessUnitOptions,
  mapBusinessUnitsToOptions,
} from './utils/fines-finance-payload-business-unit-options.utils';
import { mapInboundFilesToTableData } from './utils/fines-finance-payload-map-inbound-files.utils';

@Injectable({ providedIn: 'root' })
export class FinesFinancePayloadService {
  private readonly dateService = inject(DateService);
  private readonly globalStore = inject(GlobalStore);

  /**
   * Builds inbound scope restrictions and selected filters for the File Handling API.
   * @param formData - Current inbound-file filter values.
   * @returns Search criteria with empty optional selections omitted.
   */
  public buildInboundFilesSearchParams(formData: IFinesFinanceInboundFilesForm): IOpalFileHandlingInterfaceFileParams {
    return buildInboundFilesSearchParams(formData, this.dateService);
  }

  /**
   * Resolves every business-unit name for displaying returned API codes.
   * @param businessUnits - Resolved business-unit reference data.
   * @returns Alphabetic name/code options, preserving leading zeros.
   */
  public mapBusinessUnitsToOptions(businessUnits: IOpalFinesBusinessUnit[]): IAlphagovAccessibleAutocompleteItem[] {
    return mapBusinessUnitsToOptions(businessUnits);
  }

  /**
   * Limits filter choices to business units where the current user can view interface files.
   * @param businessUnits - Resolved business-unit reference data.
   * @returns Permitted alphabetic name/code options.
   */
  public getPermittedBusinessUnitOptions(
    businessUnits: IOpalFinesBusinessUnit[],
  ): IAlphagovAccessibleAutocompleteItem[] {
    return getPermittedBusinessUnitOptions(businessUnits, this.globalStore.userState().business_unit_users);
  }

  /**
   * Maps API metadata into localized, sortable rows using Finance reference labels.
   * @param files - Returned files, or an absent result list.
   * @param businessUnitOptions - Names for all resolved business-unit codes.
   * @returns Rows for the presentational inbound-file viewer.
   */
  public mapInboundFilesToTableData(
    files: IOpalFileHandlingInterfaceFile[] | null | undefined,
    businessUnitOptions: IAlphagovAccessibleAutocompleteItem[],
  ): ICustomFileInterfaceViewerInboundTableWrapperTableData[] {
    return mapInboundFilesToTableData(
      files,
      {
        businessUnits: businessUnitOptions,
        sources: FINES_FINANCE_INBOUND_FILES_SOURCE_OPTIONS,
        types: FINES_FINANCE_INBOUND_FILES_TYPE_OPTIONS,
      },
      this.dateService,
    );
  }
}
