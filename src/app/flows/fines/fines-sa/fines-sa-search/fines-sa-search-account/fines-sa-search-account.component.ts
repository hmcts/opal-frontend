import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { AbstractFormParentBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-parent-base';
import { FinesSaStore } from '../../stores/fines-sa.store';
import { IFinesSaSearchAccountForm } from './interfaces/fines-sa-search-account-form.interface';
import { FINES_SA_ROUTING_PATHS } from '../../routing/constants/fines-sa-routing-paths.constant';
import { FinesSaSearchAccountFormComponent } from './fines-sa-search-account-form/fines-sa-search-account-form.component';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { IOpalFinesBusinessUnit } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit-ref-data.interface';
import { FINES_SA_SEARCH_ACCOUNT_STATE } from './constants/fines-sa-search-account-state.constant';

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

  public businessUnitRefData!: IOpalFinesBusinessUnit[];

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
   * Handles the submission of the search account form.
   *
   * Stores the provided form data and navigates to the results page.
   * @param form - The submitted search form data.
   */
  public handleSearchAccountSubmit(form: IFinesSaSearchAccountForm): void {
    // Set the search account state in the store
    this.finesSaStore.setSearchAccount(form.formData);

    // Navigate to the search results page
    this.routerNavigate(this.getResultsUrl(), true);
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
  }
}
