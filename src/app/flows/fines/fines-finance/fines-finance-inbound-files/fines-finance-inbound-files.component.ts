import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import type { IAlphagovAccessibleAutocompleteItem } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete/interfaces';
import { CustomFileInterfaceViewerComponent } from '@hmcts/opal-frontend-common/components/custom/custom-file-interface-viewer/common';
import type { ICustomFileInterfaceViewerInboundTableWrapperTableData } from '@hmcts/opal-frontend-common/components/custom/custom-file-interface-viewer/custom-inbound-file-viewer';
import { GovukErrorSummaryComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-error-summary';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import type {
  IOpalFileHandlingInterfaceFile,
  IOpalFileHandlingInterfaceFileParams,
} from '@hmcts/opal-frontend-common/services/opal-file-handling-service/interfaces';

import { FinesFinanceInterfaceFilesBaseDirective } from '../directives/fines-finance-interface-files-base/fines-finance-interface-files-base.directive';
import { FINES_FINANCE_INBOUND_FILES_INITIAL_FILTER_STATE } from './constants/fines-finance-inbound-files-initial-filter-state.constant';
import { FINES_FINANCE_INBOUND_FILES_SOURCE_OPTIONS } from './constants/fines-finance-inbound-files-source-options.constant';
import { FINES_FINANCE_INBOUND_FILES_TYPE_OPTIONS } from './constants/fines-finance-inbound-files-type-options.constant';
import type { IFinesFinanceInboundFilesForm } from './interfaces/fines-finance-inbound-files-form.interface';
import { buildInboundFilesSearchParams } from './utils/fines-finance-payload-build-inbound-files-search.utils';
import { mapInboundFilesToTableData } from './utils/fines-finance-payload-map-inbound-files.utils';

/**
 * Supplies inbound choices, query scope and row mappings to the shared directive and library viewer.
 * Finance routing resolves business-unit reference data before this page is created.
 */
@Component({
  selector: 'app-fines-ext-finance-inbound-files',
  imports: [CustomFileInterfaceViewerComponent, GovukErrorSummaryComponent],
  templateUrl: './fines-finance-inbound-files.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesFinanceInboundFilesComponent extends FinesFinanceInterfaceFilesBaseDirective<
  IFinesFinanceInboundFilesForm,
  ICustomFileInterfaceViewerInboundTableWrapperTableData
> {
  private readonly dateService = inject(DateService);

  protected override readonly initialFilterState = FINES_FINANCE_INBOUND_FILES_INITIAL_FILTER_STATE;

  public override readonly isInbound = true;
  public readonly source = FINES_FINANCE_INBOUND_FILES_SOURCE_OPTIONS;
  public readonly sourceList = FINES_FINANCE_INBOUND_FILES_TYPE_OPTIONS;

  /**
   * Combines the fixed inbound scope with business-unit, date, source and type selections.
   * @param formData - Validated filter values captured for this search.
   * @returns Inbound API parameters with empty optional selections omitted and dates expressed in UTC.
   */
  protected override buildSearchParams(formData: IFinesFinanceInboundFilesForm): IOpalFileHandlingInterfaceFileParams {
    return buildInboundFilesSearchParams(formData, this.dateService);
  }

  /**
   * Passes through records already selected by the API's inbound filters without further client filtering.
   * @param files - Metadata returned for the submitted inbound criteria, including an absent list.
   * @returns The original file-list reference or its absent value.
   */
  protected override selectFiles(
    files: IOpalFileHandlingInterfaceFile[] | null | undefined,
  ): IOpalFileHandlingInterfaceFile[] | null | undefined {
    return files;
  }

  /**
   * Prepares inbound rows with local timestamps, source/type labels and shared status labels.
   * @param files - Returned file metadata, or an absent list.
   * @param businessUnits - Display names for all resolved business-unit codes, beyond the permitted filter choices.
   * @returns Display-ready inbound rows, or an empty array for an absent list.
   */
  protected override mapFilesToTableData(
    files: IOpalFileHandlingInterfaceFile[] | null | undefined,
    businessUnits: IAlphagovAccessibleAutocompleteItem[],
  ): ICustomFileInterfaceViewerInboundTableWrapperTableData[] {
    return mapInboundFilesToTableData(
      files,
      { businessUnits, sources: this.source, types: this.sourceList },
      this.dateService,
    );
  }
}
