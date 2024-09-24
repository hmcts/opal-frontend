import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { GovukButtonComponent } from '@components/govuk/govuk-button/govuk-button.component';
import { GovukCancelLinkComponent } from '@components/govuk/govuk-cancel-link/govuk-cancel-link.component';
import { FINES_MAC_ROUTING_PATHS } from '../routing/constants/fines-mac-routing-paths';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { AbstractFormParentBaseComponent } from '@components/abstract/abstract-form-parent-base/abstract-form-parent-base.component';
import { IFinesMacOffenceDetailsForm } from './interfaces/fines-mac-offence-details-form.interface';
import { FINES_MAC_STATUS } from '../constants/fines-mac-status';
import { Observable, forkJoin, map } from 'rxjs';
import { IAlphagovAccessibleAutocompleteItem } from '@components/alphagov/alphagov-accessible-autocomplete/interfaces/alphagov-accessible-autocomplete-item.interface';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesOffencesRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-offences-ref-data.interface';
import { FinesMacOffenceDetailsAddAnOffenceComponent } from './fines-mac-offence-details-add-an-offence/fines-mac-offence-details-add-an-offence.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IOpalFinesResultsRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-results-ref-data.interface';
import { FINES_MAC_OFFENCE_DETAILS_RESULTS_CODES } from './constants/fines-mac-offence-details-result-codes';

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
export class FinesMacOffenceDetailsComponent extends AbstractFormParentBaseComponent {
  private opalFinesService = inject(OpalFines);
  protected readonly finesService = inject(FinesService);
  public defendantType = this.finesService.finesMacState.accountDetails.formData.defendant_type!;
  private offenceCodes$: Observable<IOpalFinesOffencesRefData> = this.opalFinesService.getOffences(0);
  private resultCodeArray: string[] = Object.values(FINES_MAC_OFFENCE_DETAILS_RESULTS_CODES);
  private resultCodeData$: Observable<IAlphagovAccessibleAutocompleteItem[]> = this.opalFinesService
    .getResults(this.resultCodeArray)
    .pipe(
      map((response: IOpalFinesResultsRefData) => {
        return this.createAutoCompleteItemsResults(response);
      }),
    );
  protected groupOffenceCodeAndResultData$ = forkJoin({
    offenceCodeData: this.offenceCodes$,
    resultCodeData: this.resultCodeData$,
  });
  protected readonly finesMacRoutes = FINES_MAC_ROUTING_PATHS;

  /**
   * Creates an array of autocomplete items based on the provided response data.
   * @param response - The response data containing the reference data.
   * @returns An array of autocomplete items.
   */
  private createAutoCompleteItemsResults(response: IOpalFinesResultsRefData): IAlphagovAccessibleAutocompleteItem[] {
    const results = response.refData;

    results.sort((a, b) => {
      return a.imposition_allocation_order - b.imposition_allocation_order;
    });

    return results.map((item) => {
      return {
        value: item.result_id,
        name: item.result_title + ` (${item.result_id})`,
      };
    });
  }

  /**
   * Handles the submission of the offence details form.
   * Updates the finesMacState with the new offence details and sets unsavedChanges and stateChanges flags.
   * Navigates to the appropriate route based on whether it's a nested flow or not.
   *
   * @param form - The offence details form data.
   */
  public handleOffenceDetailsSubmit(form: IFinesMacOffenceDetailsForm): void {
    // Update the status as form is mandatory
    form.status = FINES_MAC_STATUS.PROVIDED;

    // Update the state with the form data
    this.finesService.finesMacState = {
      ...this.finesService.finesMacState,
      offenceDetails: {
        formData: [...form.formData],
        nestedFlow: form.nestedFlow,
        status: form.status,
      },
      unsavedChanges: false,
      stateChanges: true,
    };

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
}
