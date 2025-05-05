import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { GovukBackLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-back-link';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CanDeactivateTypes } from '@hmcts/opal-frontend-common/guards/can-deactivate/types';
import { FinesMacOffenceDetailsSearchOffencesStore } from '../stores/fines-mac-offence-details-search-offences.store';
import { map, Observable } from 'rxjs';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { IOpalFinesSearchOffencesParams } from '@services/fines/opal-fines-service/interfaces/opal-fines-search-offences-params.interface';
import { CommonModule } from '@angular/common';
import { FinesMacOffenceDetailsSearchOffencesResultsTableWrapperComponent } from './fines-mac-offence-details-search-offences-results-table-wrapper/fines-mac-offence-details-search-offences-results-table-wrapper.component';
import { FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_RESULTS_TABLE_WRAPPER_SORT_DEFAULT } from './fines-mac-offence-details-search-offences-results-table-wrapper/constants/fines-mac-offence-details-search-offences-results-table-wrapper-sort-defaults.constant';
import { IFinesMacOffenceDetailsSearchOffencesResultsTableWrapperTableData } from './fines-mac-offence-details-search-offences-results-table-wrapper/interfaces/fines-mac-offence-details-search-offences-results-table-wrapper-table-data.interface';
import { IOpalFinesSearchOffencesData } from '@services/fines/opal-fines-service/interfaces/opal-fines-search-offences.interface';

@Component({
  selector: 'app-fines-mac-offence-details-search-offences-results',
  imports: [
    CommonModule,
    RouterModule,
    GovukBackLinkComponent,
    FinesMacOffenceDetailsSearchOffencesResultsTableWrapperComponent,
  ],
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
  private readonly opalFinesService = inject(OpalFines);
  private readonly dateService = inject(DateService);

  private readonly finesMacOffenceDetailsSearchOffencesStore = inject(FinesMacOffenceDetailsSearchOffencesStore);
  public readonly tableSort = FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_RESULTS_TABLE_WRAPPER_SORT_DEFAULT;
  private readonly todayIsoDate: string = this.dateService.getDateNow().toUTC().toISO()!;
  protected readonly searchOffencesData$: Observable<
    IFinesMacOffenceDetailsSearchOffencesResultsTableWrapperTableData[]
  > = this.opalFinesService
    .searchOffences(this.buildSearchOffencesBody())
    .pipe(map((response) => this.populateTableData(response)));

  /**
   * Builds the search offences request body by mapping form data fields
   * to the corresponding keys in the `IOpalFinesSearchOffencesParams` interface.
   * Filters out any undefined or null values from the resulting object.
   *
   * @returns {Partial<IOpalFinesSearchOffencesParams>} The filtered and mapped search offences request body.
   */
  private buildSearchOffencesBody(): Partial<IOpalFinesSearchOffencesParams> {
    // Retrieve form data from the store
    const formData = this.finesMacOffenceDetailsSearchOffencesStore.searchOffences().formData;

    // Map form data fields to the corresponding keys
    const mappedData: IOpalFinesSearchOffencesParams = {
      activeDate: formData.fm_offence_details_search_offences_inactive === true ? null : this.todayIsoDate,
      cjsCode: formData.fm_offence_details_search_offences_code,
      title: formData.fm_offence_details_search_offences_short_title,
      actAndSection: formData.fm_offence_details_search_offences_act_and_section,
    };

    // Filter out undefined or null values
    const filteredData = Object.keys(mappedData).reduce((acc, key) => {
      const typedKey = key as keyof IOpalFinesSearchOffencesParams;
      const value = mappedData[typedKey];
      if (value !== undefined && value !== null) {
        (acc as Record<string, string | number>)[typedKey] = value;
      }
      return acc;
    }, {} as Partial<IOpalFinesSearchOffencesParams>);

    return filteredData;
  }

  /**
   * Transforms the response data from an offence search into a format suitable for table display.
   *
   * @param response - The response object containing offence search data.
   * @returns An array of table data objects, each representing an offence with its details.
   */
  private populateTableData(
    response: IOpalFinesSearchOffencesData,
  ): IFinesMacOffenceDetailsSearchOffencesResultsTableWrapperTableData[] {
    return response.searchData.map((offence) => {
      return {
        Code: offence.cjs_code,
        'Short title': offence.offence_title,
        'Act and section': offence.offence_oas,
        'Used from': offence.date_used_from,
        'Used to': offence.date_used_to,
      };
    });
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
