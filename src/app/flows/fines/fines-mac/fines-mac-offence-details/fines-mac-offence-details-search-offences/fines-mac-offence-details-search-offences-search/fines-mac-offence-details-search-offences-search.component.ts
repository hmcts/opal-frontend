import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FinesMacOffenceDetailsSearchOffencesSearchFormComponent } from './fines-mac-offence-details-search-offences-search-form/fines-mac-offence-details-search-offences-search-form.component';
import { IFinesMacOffenceDetailsSearchOffencesForm } from '../interfaces/fines-mac-offence-details-search-offences-form.interface';
import { FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_ROUTING_PATHS } from '../routing/constants/fines-mac-offence-details-search-offences-routing-paths.constant';
import { FinesMacOffenceDetailsSearchOffencesStore } from '../stores/fines-mac-offence-details-search-offences.store';
import { AbstractFormParentBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-parent-base';

@Component({
  selector: 'app-fines-mac-offence-details-search-offences-search',
  imports: [FinesMacOffenceDetailsSearchOffencesSearchFormComponent],
  templateUrl: './fines-mac-offence-details-search-offences-search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacOffenceDetailsSearchOffencesSearchComponent extends AbstractFormParentBaseComponent {
  private readonly finesMacOffenceDetailsSearchOffencesStore = inject(FinesMacOffenceDetailsSearchOffencesStore);

  /**
   * Handles the submission of the search offences form.
   *
   * This method updates the search offences state in the store with the provided form data
   * and navigates the user to the search offences results page.
   *
   * @param form - The form data containing the search offences details.
   */
  public handleSearchOffencesSubmit(form: IFinesMacOffenceDetailsSearchOffencesForm): void {
    this.finesMacOffenceDetailsSearchOffencesStore.setSearchOffences(form);

    const {
      fm_offence_details_search_offences_act_section,
      fm_offence_details_search_offences_code,
      fm_offence_details_search_offences_inactive,
      fm_offence_details_search_offences_short_title,
    } = form.formData;

    this.routerNavigate(
      FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_ROUTING_PATHS.children.searchOffencesResults,
      undefined,
      undefined,
      {
        payload: {
          code: fm_offence_details_search_offences_code,
          short_title: fm_offence_details_search_offences_short_title,
          act_section: fm_offence_details_search_offences_act_section,
          inactive: fm_offence_details_search_offences_inactive,
        },
      },
    );
  }

  /**
   * Handles the state of unsaved changes for the component.
   *
   * This method updates the store and the local state to reflect whether
   * there are unsaved changes in the component.
   *
   * @param unsavedChanges - A boolean indicating if there are unsaved changes.
   */
  public handleUnsavedChanges(unsavedChanges: boolean): void {
    this.finesMacOffenceDetailsSearchOffencesStore.setUnsavedChanges(unsavedChanges);
    this.stateUnsavedChanges = unsavedChanges;
  }
}
