import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AbstractFormParentBaseComponent } from '@components/abstract/abstract-form-parent-base/abstract-form-parent-base.component';
import { IAlphagovAccessibleAutocompleteItem } from '@components/alphagov/alphagov-accessible-autocomplete/interfaces/alphagov-accessible-autocomplete-item.interface';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { IOpalFinesResultsRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-results-ref-data.interface';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { Observable, forkJoin, map } from 'rxjs';
import { FINES_MAC_STATUS } from '../../constants/fines-mac-status';
import { FINES_MAC_ROUTING_PATHS } from '../../routing/constants/fines-mac-routing-paths';
import { FINES_MAC_OFFENCE_DETAILS_RESULTS_CODES } from '../constants/fines-mac-offence-details-result-codes.constant';
import { IFinesMacOffenceDetailsForm } from '../interfaces/fines-mac-offence-details-form.interface';
import { FinesMacOffenceDetailsAddAnOffenceFormComponent } from './fines-mac-offence-details-add-an-offence-form/fines-mac-offence-details-add-an-offence-form.component';
import { FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS } from '../routing/constants/fines-mac-offence-details-routing-paths.constant';
import { FINES_MAC_OFFENCE_DETAILS_FORM } from '../constants/fines-mac-offence-details-form.constant';
import { IOpalFinesMajorCreditorRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-major-creditor-ref-data.interface';

@Component({
  selector: 'app-fines-mac-offence-details-add-an-offence',
  standalone: true,
  imports: [CommonModule, RouterModule, FinesMacOffenceDetailsAddAnOffenceFormComponent],
  templateUrl: './fines-mac-offence-details-add-an-offence.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacOffenceDetailsAddAnOffenceComponent extends AbstractFormParentBaseComponent implements OnInit {
  private readonly opalFinesService = inject(OpalFines);
  protected readonly finesService = inject(FinesService);
  public defendantType = this.finesService.finesMacState.accountDetails.formData.fm_create_account_defendant_type!;
  private readonly resultCodeArray: string[] = Object.values(FINES_MAC_OFFENCE_DETAILS_RESULTS_CODES);
  private readonly resultCodeData$: Observable<IAlphagovAccessibleAutocompleteItem[]> = this.opalFinesService
    .getResults(this.resultCodeArray)
    .pipe(
      map((response: IOpalFinesResultsRefData) => {
        return this.createAutoCompleteItemsResults(response);
      }),
    );
  private readonly majorCreditorData$: Observable<IAlphagovAccessibleAutocompleteItem[]> = this.opalFinesService
    .getMajorCreditors(this.finesService.finesMacState.businessUnit.business_unit_id)
    .pipe(
      map((response: IOpalFinesMajorCreditorRefData) => {
        return this.createAutoCompleteItemsMajorCreditors(response);
      }),
    );

  protected groupResultCodeAndMajorCreditorData$ = forkJoin({
    resultCodeData: this.resultCodeData$,
    majorCreditorData: this.majorCreditorData$,
  });
  protected readonly finesMacRoutes = FINES_MAC_ROUTING_PATHS;
  protected readonly finesMacOffenceDetailsRoutes = FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS;
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

  private createAutoCompleteItemsMajorCreditors(
    response: IOpalFinesMajorCreditorRefData,
  ): IAlphagovAccessibleAutocompleteItem[] {
    const results = response.refData;

    return results.map((item) => {
      return {
        value: item.major_creditor_id,
        name: this.opalFinesService.getMajorCreditorPrettyName(item),
      };
    });
  }

  private removeIndexFromImpositionKeys(form: IFinesMacOffenceDetailsForm): IFinesMacOffenceDetailsForm {
    return {
      formData: {
        ...form.formData,
        fm_offence_details_impositions: form.formData.fm_offence_details_impositions.map((imposition: any) => {
          const cleanedImposition: any = {};
          Object.keys(imposition).forEach((key) => {
            // Use regex to remove the _{{index}} from the key
            const newKey = key.replace(/_\d+$/, '');
            cleanedImposition[newKey] = imposition[key];
          });
          return cleanedImposition;
        }),
      },
      nestedFlow: form.nestedFlow,
      status: form.status,
    };
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

    form = this.removeIndexFromImpositionKeys(form);

    if (index !== -1) {
      this.finesService.finesMacState.offenceDetails[index] = form;
    } else {
      this.finesService.finesMacState.offenceDetails.push(form);
    }
  }

  /**
   * Retrieves the form data for adding an offence.
   * If the offence details are empty, it sets the formDataIndex to 0 and assigns the default form data.
   * Otherwise, it sets the formDataIndex to the length of offenceDetails + 1.
   */
  private retrieveFormData(): void {
    if (this.finesService.finesMacState.offenceDetails.length === 0) {
      this.formDataIndex = 0;
      this.finesService.finesMacState.offenceDetails = FINES_MAC_OFFENCE_DETAILS_FORM;
    } else {
      this.formDataIndex = this.finesService.finesMacState.offenceDetails.length - 1;
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
      unsavedChanges: false,
      stateChanges: true,
    };

    this.updateOffenceDetailsIndex(form);

    if (form.nestedFlow) {
      this.routerNavigate(FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.addOffence);
    } else {
      this.routerNavigate(FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.reviewOffences);
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
    this.retrieveFormData();
  }
}
