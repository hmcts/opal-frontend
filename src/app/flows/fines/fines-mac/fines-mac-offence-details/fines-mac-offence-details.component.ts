import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { GovukButtonComponent } from '@components/govuk/govuk-button/govuk-button.component';
import { GovukCancelLinkComponent } from '@components/govuk/govuk-cancel-link/govuk-cancel-link.component';
import { FINES_MAC_ROUTING_PATHS } from '../routing/constants/fines-mac-routing-paths';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { AbstractFormParentBaseComponent } from '@components/abstract/abstract-form-parent-base/abstract-form-parent-base.component';
import { IFinesMacOffenceDetailsForm } from './interfaces/fines-mac-offence-details-form.interface';
import { FINES_MAC_STATUS } from '../constants/fines-mac-status';
import { Observable, map } from 'rxjs';
import { IAlphagovAccessibleAutocompleteItem } from '@components/alphagov/alphagov-accessible-autocomplete/interfaces/alphagov-accessible-autocomplete-item.interface';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FinesMacOffenceDetailsAddAnOffenceComponent } from './fines-mac-offence-details-add-an-offence/fines-mac-offence-details-add-an-offence.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IOpalFinesResultsRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-results-ref-data.interface';
import { FINES_MAC_OFFENCE_DETAILS_RESULTS_CODES } from './constants/fines-mac-offence-details-result-codes';
import { IFinesMacOffenceDetailsState } from './interfaces/fines-mac-offence-details-state.interface';
import { FINES_MAC_OFFENCE_DETAILS_STATE } from './constants/fines-mac-offence-details-state';

@Component({
  selector: 'app-fines-mac-offence-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    GovukButtonComponent,
    GovukCancelLinkComponent,
    FinesMacOffenceDetailsAddAnOffenceComponent,
  ],
  templateUrl: './fines-mac-offence-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacOffenceDetailsComponent extends AbstractFormParentBaseComponent implements OnInit {
  private readonly opalFinesService = inject(OpalFines);
  protected readonly finesService = inject(FinesService);
  public defendantType = this.finesService.finesMacState.accountDetails.formData.fm_create_account_defendant_type!;
  private readonly resultCodeArray: string[] = Object.values(FINES_MAC_OFFENCE_DETAILS_RESULTS_CODES);
  public readonly resultCodeData$: Observable<IAlphagovAccessibleAutocompleteItem[]> = this.opalFinesService
    .getResults(this.resultCodeArray)
    .pipe(
      map((response: IOpalFinesResultsRefData) => {
        return this.createAutoCompleteItemsResults(response);
      }),
    );
  protected readonly finesMacRoutes = FINES_MAC_ROUTING_PATHS;
  public formData!: IFinesMacOffenceDetailsState;
  public formDataIndex!: number;

  /**
   * Creates an array of autocomplete items based on the provided response data.
   * @param response - The response data containing the reference data.
   * @returns An array of autocomplete items.
   */
  private createAutoCompleteItemsResults(response: IOpalFinesResultsRefData): IAlphagovAccessibleAutocompleteItem[] {
    const results = response.refData;

    results.sort((a, b) => {
      const orderDiff = a.imposition_allocation_order! - b.imposition_allocation_order!;

      if (orderDiff !== 0) {
        return orderDiff;
      }

      // If imposition_allocation_order is the same, compare by result_title
      return a.result_title.localeCompare(b.result_title);
    });

    return results.map((item) => {
      return {
        value: item.result_id,
        name: this.opalFinesService.getResultPrettyName(item),
      };
    });
  }

  /**
   * Updates the offence details in the finesMacState based on the provided form data.
   * If an offence detail with the same fm_offence_details_index already exists, it will be updated.
   * Otherwise, the new offence detail will be added to the finesMacState.
   *
   * @param form - The form data containing the offence details to be updated or added.
   */
  private updateOffenceDetailsIndex(form: IFinesMacOffenceDetailsForm): void {
    const index = this.finesService.finesMacState.offenceDetails.findIndex(
      (item) => item.formData.fm_offence_details_index === form.formData.fm_offence_details_index,
    );

    if (index !== -1) {
      this.finesService.finesMacState.offenceDetails[index] = form;
    } else {
      this.finesService.finesMacState.offenceDetails.push(form);
    }
  }

  /**
   * Handles the submission of the offence details form.
   *
   * @param form - The offence details form data.
   */
  public handleOffenceDetailsSubmit(form: IFinesMacOffenceDetailsForm): void {
    // Update the status as form is mandatory
    form.status = FINES_MAC_STATUS.PROVIDED;

    // Update the state with the form data
    this.finesService.finesMacState = {
      ...this.finesService.finesMacState,
      offenceDetails: [...this.finesService.finesMacState.offenceDetails],
      unsavedChanges: false,
      stateChanges: true,
    };

    this.updateOffenceDetailsIndex(form);

    if (form.nestedFlow) {
      this.routerNavigate(FINES_MAC_ROUTING_PATHS.children.offenceDetails);
    } else {
      this.routerNavigate(FINES_MAC_ROUTING_PATHS.children.accountDetails);
    }
  }

  /**
   * Handles unsaved changes coming from the child component
   *
   * @param unsavedChanges boolean value from child component
   */
  public handleUnsavedChanges(unsavedChanges: boolean): void {
    this.finesService.finesMacState.unsavedChanges = unsavedChanges;
    this.stateUnsavedChanges = unsavedChanges;
  }

  /**
   * Initializes the component.
   */
  public ngOnInit(): void {
    this.formData =
      this.finesService.finesMacState.offenceDetails.length > 0
        ? this.finesService.finesMacState.offenceDetails[0].formData
        : FINES_MAC_OFFENCE_DETAILS_STATE;
    this.formDataIndex = 0;
  }
}
