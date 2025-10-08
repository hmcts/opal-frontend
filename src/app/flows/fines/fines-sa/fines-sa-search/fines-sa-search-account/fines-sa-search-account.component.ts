import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { AbstractFormParentBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-parent-base';
import { FinesSaStore } from '../../stores/fines-sa.store';
import { IFinesSaSearchAccountForm } from './interfaces/fines-sa-search-account-form.interface';
import { FINES_SA_ROUTING_PATHS } from '../../routing/constants/fines-sa-routing-paths.constant';
import { FinesSaSearchAccountFormComponent } from './fines-sa-search-account-form/fines-sa-search-account-form.component';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { IOpalFinesBusinessUnit } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit-ref-data.interface';
import { FINES_SA_SEARCH_ACCOUNT_STATE } from './constants/fines-sa-search-account-state.constant';
import { FINES_ACC_ROUTING_PATHS } from '../../../fines-acc/routing/constants/fines-acc-routing-paths.constant';
import { IOpalFinesMajorCreditor } from '@services/fines/opal-fines-service/interfaces/opal-fines-major-creditor-ref-data.interface';

@Component({
  selector: 'app-fines-sa-search-account',
  imports: [FinesSaSearchAccountFormComponent],
  templateUrl: './fines-sa-search-account.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesSaSearchAccountComponent extends AbstractFormParentBaseComponent implements OnInit {
  private readonly finesSaStore = inject(FinesSaStore);
  private readonly finesRoutingPaths = FINES_ROUTING_PATHS;
  private readonly finesSaRoutingPaths = FINES_SA_ROUTING_PATHS;
  private readonly finesAccRoutingPaths = FINES_ACC_ROUTING_PATHS;

  public businessUnitRefData!: IOpalFinesBusinessUnit[];
  public majorCreditorsRefData!: IOpalFinesMajorCreditor[];

  /**
   * Constructs and returns the URL path for the fines search results page.
   *
   * The URL is composed by concatenating the root path for fines, the root path for fines SA,
   * and the child path for the results page, using the routing paths defined in the component.
   *
   * @returns {string} The constructed URL path for the fines SA search results.
   */
  private getResultsUrl(): string {
    return `${this.finesRoutingPaths.root}/${this.finesSaRoutingPaths.root}/${this.finesSaRoutingPaths.children.results}`;
  }

  /**
   * Constructs the URL for an account enquiry based on the provided account ID.
   *
   * @param accountId - The unique identifier of the account.
   * @returns The constructed URL string for the account enquiry.
   */
  private getAccountEnquiryUrl(accountId: number): string {
    // TODO: change 'defendant' to 'major-creditor' when that page is implemented
    return `${this.finesRoutingPaths.root}/${this.finesAccRoutingPaths.root}/${accountId}/${this.finesAccRoutingPaths.children.defendant}`;
  }

  /**
   * Retrieves business unit reference data from the route resolver and ensures the store
   * has a default search account business unit selection.
   *
   * - Reads resolver data from the activated route snapshot.
   * - Filters the refData to only include business units that have an `opal_domain`.
   * - Assigns the filtered array to `this.businessUnitRefData`.
   * - If the store's search account does not already have `fsa_search_account_business_unit_ids`,
   *   initializes the search account state with the IDs of the filtered business units.
   *
   * @private
   * @returns void
   */
  private getBusinessUnits(): void {
    const resolverData = this['activatedRoute']?.snapshot?.data?.['businessUnits'];
    const refData = resolverData?.refData as IOpalFinesBusinessUnit[] | undefined;
    this.businessUnitRefData = Array.isArray(refData) ? refData.filter((bu) => Boolean(bu?.opal_domain)) : [];
    if (!this.finesSaStore.searchAccount().fsa_search_account_business_unit_ids) {
      this.finesSaStore.setSearchAccount({
        ...FINES_SA_SEARCH_ACCOUNT_STATE,
        fsa_search_account_business_unit_ids: this.businessUnitRefData.map((bu) => bu.business_unit_id),
      });
    }
  }

  /**
   * Retrieves the major creditors data from the activated route's snapshot resolver data.
   * If the resolver data contains a valid `refData` array, it assigns it to `majorCreditorsRefData`.
   * Otherwise, it initializes `majorCreditorsRefData` as an empty array.
   *
   * This method is used to populate the `majorCreditorsRefData` property with data
   * resolved during route activation.
   *
   * @private
   */
  private getMajorCreditors(): void {
    const resolverData = this['activatedRoute']?.snapshot?.data?.['majorCreditors'];
    this.majorCreditorsRefData = Array.isArray(resolverData?.refData) ? resolverData.refData : [];
  }

  /**
   * Navigates to the major creditor page for the specified account ID.
   * Constructs a URL for the account enquiry page using the provided account ID,
   * serializes it, and opens it in a new browser tab.
   *
   * @param accountId - The unique identifier of the account to navigate to.
   */
  private navigateToMajorCreditor(accountId: number): void {
    const url = this['router'].serializeUrl(this['router'].createUrlTree([this.getAccountEnquiryUrl(accountId)]));
    window.open(url, '_blank');
  }

  /**
   * Handles the submission of the search account form.
   *
   * This method performs the following actions:
   * 1. Updates the search account state in the store with the provided form data.
   * 2. Navigates to the appropriate page based on the active tab in the store:
   *    - If the active tab is 'majorCreditors', it navigates to the major creditor's page
   *      using the provided major creditor ID from the form data.
   *    - Otherwise, it navigates to the search results page.
   *
   * @param form - The form data of type `IFinesSaSearchAccountForm` containing the search account details.
   */
  public handleSearchAccountSubmit(form: IFinesSaSearchAccountForm): void {
    // Set the search account state in the store
    this.finesSaStore.setSearchAccount(form.formData);

    // Navigate to the search results page
    if (this.finesSaStore.activeTab() === 'majorCreditors') {
      this.navigateToMajorCreditor(
        form.formData.fsa_search_account_major_creditors_search_criteria!
          .fsa_search_account_major_creditors_major_creditor_id!,
      );
    } else {
      this.routerNavigate(this.getResultsUrl(), true);
    }
  }

  /**
   * Updates the internal and store state to track unsaved changes.
   * @param unsavedChanges - Boolean flag indicating if the form has unsaved changes.
   */
  public handleUnsavedChanges(unsavedChanges: boolean): void {
    this.finesSaStore.setUnsavedChanges(unsavedChanges);
    this.stateUnsavedChanges = unsavedChanges;
  }

  public ngOnInit(): void {
    this.getBusinessUnits();
    this.getMajorCreditors();
  }
}
