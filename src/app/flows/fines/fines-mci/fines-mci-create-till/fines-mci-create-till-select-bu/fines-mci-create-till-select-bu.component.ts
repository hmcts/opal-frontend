import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FINES_ROUTING_PATHS } from '@app/flows/fines/routing/constants/fines-routing-paths.constant';
import { AlphagovAccessibleAutocompleteComponent } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete';
import { IAlphagovAccessibleAutocompleteItem } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete/interfaces';
import { GovukButtonComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-button';
import { GovukCancelLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-cancel-link';
import {
  GovukSummaryListComponent,
  GovukSummaryListRowComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-summary-list';
import { IOpalFinesBusinessUnitRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit-ref-data.interface';
import { IOpalFinesBusinessUnit } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit.interface';
import { FINES_MCI_ROUTING_PATHS } from '../../routing/constants/fines-mci-routing-paths.constant';
import { FinesMciStore } from '../../stores/fines-mci.store';

@Component({
  selector: 'app-fines-mci-create-till-select-bu',
  imports: [
    AlphagovAccessibleAutocompleteComponent,
    GovukButtonComponent,
    GovukCancelLinkComponent,
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
  private readonly finesMciStore = inject(FinesMciStore);
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

  public constructor() {
    this.setInitialBusinessUnit();
  }

  /**
   * Creates autocomplete items from business unit reference data.
   */
  private createAutoCompleteItems(result: IOpalFinesBusinessUnitRefData): IAlphagovAccessibleAutocompleteItem[] {
    return result.refData.map((businessUnit: IOpalFinesBusinessUnit) => ({
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
      this.form.markAllAsTouched();
      return;
    }

    this.finesMciStore.setBusinessUnit(businessUnit);
    void this.router.navigate([
      '/',
      FINES_ROUTING_PATHS.root,
      FINES_MCI_ROUTING_PATHS.root,
      FINES_MCI_ROUTING_PATHS.children.createTillDetails,
    ]);
  }

  /**
   * Returns the user to the manual cash input create and allocate page.
   */
  public handleCancel(): void {
    this.finesMciStore.reset();
    void this.router.navigate(this.createAllocateRoute);
  }
}
