import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, OnInit, inject, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IAlphagovAccessibleAutocompleteItem } from '@components/alphagov/alphagov-accessible-autocomplete/interfaces/alphagov-accessible-autocomplete-item.interface';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { IOpalFinesResultsRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-results-ref-data.interface';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { Observable, forkJoin, map } from 'rxjs';
import { FINES_MAC_STATUS } from '../../constants/fines-mac-status';
import { FINES_MAC_ROUTING_PATHS } from '../../routing/constants/fines-mac-routing-paths.constant';
import { FINES_MAC_OFFENCE_DETAILS_RESULTS_CODES } from '../constants/fines-mac-offence-details-result-codes.constant';
import { IFinesMacOffenceDetailsForm } from '../interfaces/fines-mac-offence-details-form.interface';
import { FinesMacOffenceDetailsAddAnOffenceFormComponent } from './fines-mac-offence-details-add-an-offence-form/fines-mac-offence-details-add-an-offence-form.component';
import { FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS } from '../routing/constants/fines-mac-offence-details-routing-paths.constant';
import { IOpalFinesMajorCreditorRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-major-creditor-ref-data.interface';
import { FinesMacOffenceDetailsService } from '../services/fines-mac-offence-details-service/fines-mac-offence-details.service';
import { AbstractFormArrayParentBaseComponent } from '@components/abstract/abstract-form-array-parent-base/abstract-form-array-parent-base.component';
import { DateService } from '@services/date-service/date.service';

@Component({
  selector: 'app-fines-mac-offence-details-add-an-offence',

  imports: [CommonModule, RouterModule, FinesMacOffenceDetailsAddAnOffenceFormComponent],
  templateUrl: './fines-mac-offence-details-add-an-offence.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacOffenceDetailsAddAnOffenceComponent
  extends AbstractFormArrayParentBaseComponent
  implements OnInit, OnDestroy
{
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly opalFinesService = inject(OpalFines);
  protected readonly finesService = inject(FinesService);
  private readonly finesMacOffenceDetailsService = inject(FinesMacOffenceDetailsService);
  private readonly dateService = inject(DateService);
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
  public offenceIndex!: number;
  public showOffenceDetailsForm: boolean = true;

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

  /**
   * Updates the offence details in the finesMacState based on the provided form data.
   * If an offence detail with the same fm_offence_details_id already exists, it will be updated.
   * Otherwise, the new offence detail will be added to the finesMacState.
   *
   * @param form - The form data containing the offence details to be updated or added.
   */
  private updateOffenceDetailsIndex(form: IFinesMacOffenceDetailsForm): void {
    // Update the impositions array with their respective index positions
    form.formData.fm_offence_details_impositions.forEach((imposition, index) => {
      imposition.fm_offence_details_imposition_id = index;
    });

    form.formData.fm_offence_details_impositions = this.removeIndexFromFormArrayData(
      form.formData.fm_offence_details_impositions,
    );

    // Change the amount imposed and amount paid to numbers
    form.formData.fm_offence_details_impositions.forEach((imposition) => {
      imposition.fm_offence_details_amount_imposed = +imposition.fm_offence_details_amount_imposed!;
      imposition.fm_offence_details_amount_paid = imposition.fm_offence_details_amount_paid
        ? +imposition.fm_offence_details_amount_paid
        : 0;
    });

    const { offenceDetails } = this.finesService.finesMacState;
    const { offenceDetailsDraft } = this.finesMacOffenceDetailsService.finesMacOffenceDetailsDraftState;

    if (offenceDetailsDraft.length === 1 && offenceDetailsDraft[0].childFormData) {
      form.childFormData = offenceDetailsDraft[0].childFormData;
    }

    const index = offenceDetails.findIndex(
      (item) => item.formData.fm_offence_details_id === form.formData.fm_offence_details_id,
    );

    if (index !== -1) {
      offenceDetails[index] = { ...offenceDetails[index], formData: form.formData };
    } else {
      offenceDetails.push(form);
    }
  }

  /**
   * Retrieves the form data for adding an offence.
   * If the offence details are empty, it sets the offenceIndex to 0 and assigns the default form data.
   * Otherwise, it sets the offenceIndex to the length of offenceDetails + 1.
   */
  private retrieveFormData(): void {
    if (this.finesService.finesMacState.offenceDetails.length === 0) {
      this.offenceIndex = 0;
    } else {
      this.offenceIndex = this.finesMacOffenceDetailsService.offenceIndex;
    }
  }

  /**
   * Handles the addition of another offence in the nested flow.
   * Increments the offence index, sets the emptyOffences flag to false,
   * shows the offence details form, and triggers change detection.
   *
   * @private
   * @returns {void}
   */
  private handleAddAnotherOffenceNestedFlow(): void {
    this.showOffenceDetailsForm = false;
    this.changeDetectorRef.detectChanges();
    ++this.offenceIndex;
    this.finesMacOffenceDetailsService.minorCreditorAdded = false;
    this.finesMacOffenceDetailsService.emptyOffences = false;
    this.finesMacOffenceDetailsService.finesMacOffenceDetailsDraftState.offenceDetailsDraft = [];
    this.showOffenceDetailsForm = true;
    this.changeDetectorRef.detectChanges();
  }

  /**
   * Adds an offence code message to the offence details service.
   *
   * @param code - The offence code to be added.
   */
  private addOffenceCodeMessage(code: string): void {
    this.finesMacOffenceDetailsService.offenceCodeMessage = `Offence ${code} added`;
  }

  /**
   * Retrieves the collection order date from the payment terms.
   *
   * @returns {Date | null} The collection order date if available, otherwise null.
   */
  private getCollectionOrderDate(): Date | null {
    const { formData: paymentTerms } = this.finesService.finesMacState.paymentTerms;
    if (paymentTerms?.fm_payment_terms_collection_order_date) {
      return this.dateService.getDateFromFormat(paymentTerms.fm_payment_terms_collection_order_date, 'dd/MM/yyyy');
    }
    return null;
  }

  /**
   * Checks the payment terms collection order by comparing the collection order date
   * with the earliest date of sentence. If the collection order date is earlier than
   * the earliest date of sentence, it sets the payment terms status to INCOMPLETE.
   *
   * @private
   * @returns {void}
   */
  private checkPaymentTermsCollectionOrder(): void {
    const collectionOrderDate = this.getCollectionOrderDate();
    const earliestDateOfSentence = this.finesService.getEarliestDateOfSentence();
    const hasCollectionOrderEarliestDate = collectionOrderDate && earliestDateOfSentence;
    const isCollectionOrderLessThanEarliestDate = hasCollectionOrderEarliestDate
      ? collectionOrderDate < earliestDateOfSentence
      : false;

    if (hasCollectionOrderEarliestDate && isCollectionOrderLessThanEarliestDate) {
      this.finesService.finesMacState.paymentTerms.status = FINES_MAC_STATUS.INCOMPLETE;
    } else if (collectionOrderDate) {
      this.finesService.finesMacState.paymentTerms.status = FINES_MAC_STATUS.PROVIDED;
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
    form.childFormData = [];

    // Update the state with the form data
    this.finesService.finesMacState = {
      ...this.finesService.finesMacState,
      unsavedChanges: false,
      stateChanges: true,
    };

    this.updateOffenceDetailsIndex(form);
    this.checkPaymentTermsCollectionOrder();

    this.finesMacOffenceDetailsService.addedOffenceCode = form.formData.fm_offence_details_offence_cjs_code!;
    this.addOffenceCodeMessage(form.formData.fm_offence_details_offence_cjs_code!);

    if (form.nestedFlow) {
      this.handleAddAnotherOffenceNestedFlow();
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

  public ngOnInit(): void {
    this.retrieveFormData();
  }

  public ngOnDestroy(): void {
    this.finesMacOffenceDetailsService.minorCreditorAdded = false;
  }
}
