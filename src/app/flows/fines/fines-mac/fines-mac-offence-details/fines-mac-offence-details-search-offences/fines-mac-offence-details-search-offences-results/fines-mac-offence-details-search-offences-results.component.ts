import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { GovukBackLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-back-link';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CanDeactivateTypes } from '@hmcts/opal-frontend-common/guards/can-deactivate/types';
import { FinesMacOffenceDetailsSearchOffencesStore } from '../stores/fines-mac-offence-details-search-offences.store';
import { CommonModule } from '@angular/common';
import { FinesMacOffenceDetailsSearchOffencesResultsTableWrapperComponent } from './fines-mac-offence-details-search-offences-results-table-wrapper/fines-mac-offence-details-search-offences-results-table-wrapper.component';
import { FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_RESULTS_TABLE_WRAPPER_SORT_DEFAULT } from './fines-mac-offence-details-search-offences-results-table-wrapper/constants/fines-mac-offence-details-search-offences-results-table-wrapper-sort-defaults.constant';
import { IFinesMacOffenceDetailsSearchOffencesResultsTableWrapperTableData } from './fines-mac-offence-details-search-offences-results-table-wrapper/interfaces/fines-mac-offence-details-search-offences-results-table-wrapper-table-data.interface';
import {
  IOpalFinesSearchOffences,
  IOpalFinesSearchOffencesData,
} from '@services/fines/opal-fines-service/interfaces/opal-fines-search-offences.interface';

@Component({
  selector: 'app-fines-mac-offence-details-search-offences-results',
  imports: [
    CommonModule,
    RouterModule,
    GovukBackLinkComponent,
    FinesMacOffenceDetailsSearchOffencesResultsTableWrapperComponent,
  ],
  templateUrl: './fines-mac-offence-details-search-offences-results.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacOffenceDetailsSearchOffencesResultsComponent {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly finesMacOffenceDetailsSearchOffencesStore = inject(FinesMacOffenceDetailsSearchOffencesStore);

  protected readonly searchOffencesData: IFinesMacOffenceDetailsSearchOffencesResultsTableWrapperTableData[] =
    this.mapSearchOffencesToTableData();

  public readonly tableSort = FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_RESULTS_TABLE_WRAPPER_SORT_DEFAULT;
  /**
   * Maps search offences data retrieved from the activated route's snapshot
   * to a format suitable for table display.
   *
   * @returns An array of objects representing table data, where each object
   * contains the following properties:
   * - `Code`: The CJS code of the offence.
   * - `Short title`: The title of the offence.
   * - `Act and section`: The act and section of the offence.
   * - `Used from`: The date the offence was first used.
   * - `Used to`: The date the offence was last used.
   */
  private mapSearchOffencesToTableData(): IFinesMacOffenceDetailsSearchOffencesResultsTableWrapperTableData[] {
    const data = this.activatedRoute.snapshot.data['searchResults'] as IOpalFinesSearchOffencesData;
    return data.searchData.map((offence: IOpalFinesSearchOffences) => ({
      Code: offence.cjs_code,
      'Short title': offence.offence_title,
      'Act and section': offence.offence_oas,
      'Used from': offence.date_used_from,
      'Used to': offence.date_used_to,
    }));
  }

  /**
   * Checks if the component can be deactivated.
   * @returns A boolean indicating whether the component can be deactivated.
   */
  canDeactivate(): CanDeactivateTypes {
    return !this.finesMacOffenceDetailsSearchOffencesStore.unsavedChanges();
  }

  /**
   * Navigates back to the parent route relative to the current activated route.
   * Utilizes Angular's Router to perform the navigation.
   */
  public navigateBack(): void {
    this.router.navigate(['..'], { relativeTo: this.activatedRoute });
  }
}
