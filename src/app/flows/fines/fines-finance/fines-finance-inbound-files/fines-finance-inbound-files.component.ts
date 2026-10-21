import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subscription } from 'rxjs';
import { IAbstractFormBaseForm } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { IAlphagovAccessibleAutocompleteItem } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete/interfaces';
import { ActivatedRoute } from '@angular/router';
import { IOpalFinesBusinessUnitRefData } from '../../services/opal-fines-service/interfaces/opal-fines-business-unit-ref-data.interface';
import { CustomInboundFileViewerComponent } from '@hmcts/opal-frontend-common/components/custom/custom-file-interface-viewer/custom-inbound-file-viewer';
import { FinesFinancePayloadService } from '../services/fines-finance-payload.service';
import { IFinesFinanceInboundFilesForm } from '../services/interfaces/fines-finance-inbound-files-form.interface';
import { OpalFileHandlingService } from '@hmcts/opal-frontend-common/services/opal-file-handling-service';
import { IOpalFileHandlingInterfaceFilesRefData } from '@hmcts/opal-frontend-common/services/opal-file-handling-service/interfaces';
import { FINES_FINANCE_INBOUND_FILES_SOURCE_OPTIONS } from '../constants/fines-finance-inbound-files-source-options.constant';
import { FINES_FINANCE_INBOUND_FILES_TYPE_OPTIONS } from '../constants/fines-finance-inbound-files-type-options.constant';
import { FINES_FINANCE_INBOUND_FILES_INITIAL_FILTER_STATE } from '../constants/fines-finance-inbound-files-initial-filter-state.constant';

@Component({
  selector: 'app-fines-ext-finance-inbound-files',
  imports: [CustomInboundFileViewerComponent],
  templateUrl: './fines-finance-inbound-files.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesFinanceInboundFilesComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly payloadService = inject(FinesFinancePayloadService);
  private readonly opalFileHandlingService = inject(OpalFileHandlingService);
  private readonly businessUnitRefData =
    (this.activatedRoute.snapshot.data['businessUnits'] as IOpalFinesBusinessUnitRefData | null)?.refData ?? [];
  private readonly businessUnitDisplayOptions = this.payloadService.mapBusinessUnitsToOptions(this.businessUnitRefData);
  private interfaceFilesRequest?: Subscription;
  private readonly interfaceFilesRefData = signal<IOpalFileHandlingInterfaceFilesRefData | null>(null);

  public readonly source: IAlphagovAccessibleAutocompleteItem[] = FINES_FINANCE_INBOUND_FILES_SOURCE_OPTIONS;
  public readonly sourceList: IAlphagovAccessibleAutocompleteItem[] = FINES_FINANCE_INBOUND_FILES_TYPE_OPTIONS;
  public readonly businessUnits: IAlphagovAccessibleAutocompleteItem[] =
    this.payloadService.getPermittedBusinessUnitOptions(this.businessUnitRefData);
  public readonly refreshFailed = signal(false);
  public readonly tableData = computed(() => {
    const response = this.interfaceFilesRefData();
    return response === null
      ? null
      : this.payloadService.mapInboundFilesToTableData(response.interface_files, this.businessUnitDisplayOptions);
  });

  /**
   * Requests files for the submitted filters, cancelling any previous pending search.
   *
   * @param form - Submitted inbound-file filter data and form metadata.
   */
  public onFormSubmit(form: IAbstractFormBaseForm<unknown>): void {
    const searchParams = this.payloadService.buildInboundFilesSearchParams(
      form.formData as IFinesFinanceInboundFilesForm,
    );

    this.interfaceFilesRequest?.unsubscribe();
    this.refreshFailed.set(false);
    this.interfaceFilesRequest = this.opalFileHandlingService
      .getInterfaceFilesRefData(searchParams)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => this.interfaceFilesRefData.set(response),
        error: () => this.refreshFailed.set(true),
      });
  }

  /**
   * Loads inbound files on page entry using Last 7 days and empty optional filters.
   */
  public ngOnInit(): void {
    this.onFormSubmit({
      formData: { ...FINES_FINANCE_INBOUND_FILES_INITIAL_FILTER_STATE },
      nestedFlow: false,
    });
  }
}
