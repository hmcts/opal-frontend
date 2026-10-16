import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, ViewChild, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FINES_ROUTING_PATHS } from '@app/flows/fines/routing/constants/fines-routing-paths.constant';
import { AlphagovAccessibleAutocompleteComponent } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete';
import { IAlphagovAccessibleAutocompleteItem } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete/interfaces';
import { IAbstractFormBaseFormErrorSummaryMessage } from '@hmcts/opal-frontend-common/components/abstract/interfaces';
import { GovukButtonComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-button';
import { GovukCancelLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-cancel-link';
import { GovukErrorSummaryComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-error-summary';
import {
  GovukSummaryListComponent,
  GovukSummaryListRowComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-summary-list';
import { IOpalFinesBusinessUnitRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit-ref-data.interface';
import { IOpalFinesBusinessUnit } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit.interface';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { FINES_MCI_ROUTING_PATHS } from '../../routing/constants/fines-mci-routing-paths.constant';
import { FinesMciStore } from '../../stores/fines-mci.store';

@Component({
  selector: 'app-fines-mci-create-till-select-bu',
  imports: [
    AlphagovAccessibleAutocompleteComponent,
    GovukButtonComponent,
    GovukCancelLinkComponent,
    GovukErrorSummaryComponent,
    GovukSummaryListComponent,
    GovukSummaryListRowComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './fines-mci-create-till-select-bu.component.html',
  styleUrl: './fines-mci-create-till-select-bu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMciCreateTillSelectBuComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);
  private readonly changeDetector = inject(ChangeDetectorRef);
  private readonly utilsService = inject(UtilsService);
  private readonly finesMciStore = inject(FinesMciStore);
  @ViewChild('errorSummary', { read: ElementRef }) private readonly errorSummary?: ElementRef<HTMLElement>;
  private readonly businessUnitsRefData: IOpalFinesBusinessUnitRefData = (this.activatedRoute.snapshot.data[
    'businessUnits'
  ] as IOpalFinesBusinessUnitRefData | undefined) ?? {
    count: 0,
    refData: [],
  };

  protected readonly createAllocateRoute = [
    '/',
    FINES_ROUTING_PATHS.root,
    FINES_MCI_ROUTING_PATHS.root,
    FINES_MCI_ROUTING_PATHS.children.createAllocate,
  ];

  protected readonly form = new FormGroup({
    fmci_create_till_business_unit_id: new FormControl<number | null>(null, [Validators.required]),
  });
  protected readonly businessUnitAutoCompleteItems = this.createAutoCompleteItems(this.businessUnitsRefData);
  protected businessUnitSelectionError: string | null = null;
  protected formErrorSummaryMessage: IAbstractFormBaseFormErrorSummaryMessage[] = [];

  public constructor() {
    this.setInitialBusinessUnit();
    this.form.controls.fmci_create_till_business_unit_id.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((businessUnitId) => {
        const hasValidBusinessUnit = this.businessUnitsRefData.refData.some(
          ({ business_unit_id }) => business_unit_id === businessUnitId,
        );

        if (hasValidBusinessUnit) {
          this.businessUnitSelectionError = null;
          this.formErrorSummaryMessage = [];
        }
      });
  }

  /**
   * Creates autocomplete items from business unit reference data.
   */
  private createAutoCompleteItems(result: IOpalFinesBusinessUnitRefData): IAlphagovAccessibleAutocompleteItem[] {
    return [...result.refData]
      .sort((a, b) => a.business_unit_name.localeCompare(b.business_unit_name))
      .map((businessUnit: IOpalFinesBusinessUnit) => ({
        value: businessUnit.business_unit_id,
        name: businessUnit.business_unit_name,
      }));
  }

  /**
   * Defaults the form when the user has exactly one associated business unit.
   */
  private setInitialBusinessUnit(): void {
    const selectedBusinessUnitId = this.finesMciStore.businessUnit()?.business_unit_id;

    if (this.businessUnitsRefData.refData.some(({ business_unit_id }) => business_unit_id === selectedBusinessUnitId)) {
      this.form.controls.fmci_create_till_business_unit_id.setValue(selectedBusinessUnitId ?? null);
      return;
    }

    if (this.businessUnitsRefData.refData.length === 1) {
      this.form.controls.fmci_create_till_business_unit_id.setValue(
        this.businessUnitsRefData.refData[0].business_unit_id,
      );
    }
  }

  /**
   * Stores the selected business unit and continues to the till details page.
   */
  public handleSubmit(): void {
    const businessUnitId = this.form.controls.fmci_create_till_business_unit_id.value;
    const businessUnit = this.businessUnitsRefData.refData.find(
      ({ business_unit_id }) => business_unit_id === businessUnitId,
    );

    if (!businessUnit) {
      this.businessUnitSelectionError = 'Select business unit';
      this.formErrorSummaryMessage = [
        {
          fieldId: 'fmci_create_till_business_unit_id-autocomplete',
          message: this.businessUnitSelectionError,
        },
      ];
      this.form.markAllAsTouched();
      this.focusErrorSummary();
      this.utilsService.scrollToTop();
      return;
    }

    this.businessUnitSelectionError = null;
    this.formErrorSummaryMessage = [];
    this.finesMciStore.setBusinessUnit(businessUnit);
    void this.router.navigate([
      '/',
      FINES_ROUTING_PATHS.root,
      FINES_MCI_ROUTING_PATHS.root,
      FINES_MCI_ROUTING_PATHS.children.create,
      FINES_MCI_ROUTING_PATHS.children.till,
      FINES_MCI_ROUTING_PATHS.children.details,
    ]);
  }

  /**
   * Returns the user to the manual cash input create and allocate page.
   */
  public handleCancel(): void {
    this.finesMciStore.reset();
    void this.router.navigate(this.createAllocateRoute);
  }

  /**
   * Focuses the field linked from an error summary item.
   */
  protected scrollTo(fieldId: string): void {
    this.document.getElementById(fieldId)?.focus();
  }

  /**
   * Focuses the error summary after validation errors are rendered.
   */
  private focusErrorSummary(): void {
    this.changeDetector.detectChanges();
    this.errorSummary?.nativeElement.querySelector<HTMLElement>('.govuk-error-summary')?.focus({ preventScroll: true });
  }
}
