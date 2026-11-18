import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import type { IAlphagovAccessibleAutocompleteItem } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete/interfaces';
import { CustomFileInterfaceViewerComponent } from '@hmcts/opal-frontend-common/components/custom/custom-file-interface-viewer/common';
import type { ICustomFileInterfaceViewerOutboundTableWrapperTableData } from '@hmcts/opal-frontend-common/components/custom/custom-file-interface-viewer/custom-outbound-file-viewer/interfaces';
import { GovukErrorSummaryComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-error-summary';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import type {
  IOpalFileHandlingInterfaceFile,
  IOpalFileHandlingInterfaceFileParams,
} from '@hmcts/opal-frontend-common/services/opal-file-handling-service/interfaces';

import { FINES_FINANCE_INTERFACE_FILES_INITIAL_FILTER_STATE } from '../constants/fines-finance-interface-files-initial-filter-state.constant';
import { FinesFinanceInterfaceFilesBaseDirective } from '../directives/fines-finance-interface-files-base/fines-finance-interface-files-base.directive';
import type { IFinesFinanceInterfaceFilesForm } from '../interfaces/fines-finance-interface-files-form.interface';
import { buildOutboundFilesSearchParams } from './utils/fines-finance-payload-build-outbound-files-search.utils';
import { mapOutboundFilesToTableData } from './utils/fines-finance-payload-map-outbound-files.utils';

/**
 * Supplies outbound query scope and target labels to the shared directive and library viewer.
 * The API applies business-unit and date filters before the shared directive maps the response.
 */
@Component({
  selector: 'app-fines-ext-finance-outbound-files',
  imports: [CustomFileInterfaceViewerComponent, GovukErrorSummaryComponent],
  templateUrl: './fines-finance-outbound-files.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesFinanceOutboundFilesComponent extends FinesFinanceInterfaceFilesBaseDirective<
  IFinesFinanceInterfaceFilesForm,
  ICustomFileInterfaceViewerOutboundTableWrapperTableData
> {
  private readonly dateService = inject(DateService);

  protected override readonly initialFilterState = FINES_FINANCE_INTERFACE_FILES_INITIAL_FILTER_STATE;

  public override readonly isInbound = false;

  /**
   * Builds outbound scope, the selected business-unit code and UTC date boundaries.
   * @param formData - Validated filter values captured for this search.
   * @returns Outbound API parameters with optional business-unit and date filters.
   */
  protected override buildSearchParams(
    formData: IFinesFinanceInterfaceFilesForm,
  ): IOpalFileHandlingInterfaceFileParams {
    return buildOutboundFilesSearchParams(formData, this.dateService);
  }

  /**
   * Prepares outbound rows with local timestamps, target labels and shared status labels.
   * @param files - Outbound metadata returned by the API, or an absent list.
   * @param businessUnits - Display names for all resolved business-unit codes, beyond the permitted filter choices.
   * @returns Display-ready outbound rows, or an empty array for an absent list.
   */
  protected override mapFilesToTableData(
    files: IOpalFileHandlingInterfaceFile[] | null | undefined,
    businessUnits: IAlphagovAccessibleAutocompleteItem[],
  ): ICustomFileInterfaceViewerOutboundTableWrapperTableData[] {
    return mapOutboundFilesToTableData(files, businessUnits, this.dateService);
  }
}
