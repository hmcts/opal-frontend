import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CourtService, StateService } from '@services';

import { IAccountEnquiryStateSearch, IGovUkSelectOptions, ISearchCourt, ISearchCourtBody } from '@interfaces';

import { AccountEnquiryRoutes } from '@enums';
import { Observable, map } from 'rxjs';
import { SearchFormComponent } from './search-form/search-form.component';

const SEARCH_COURT_BODY: ISearchCourtBody = {
  courtId: null,
  courtCode: null,
  parentCourtId: null,
  localJusticeAreaId: null,
  nationalCourtCode: null,
};

@Component({
  selector: 'app-account-enquiry',
  standalone: true,
  imports: [CommonModule, RouterModule, SearchFormComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent {
  private readonly router = inject(Router);
  private readonly courtService = inject(CourtService);
  public readonly stateService = inject(StateService);
  public data$: Observable<IGovUkSelectOptions[]> = this.courtService.searchCourt(SEARCH_COURT_BODY).pipe(
    map((response: ISearchCourt[]) => {
      return this.mapSearchCourtToSelectOptions(response);
    }),
  );

  /**
   * Maps the search court response to an array of select options.
   *
   * @param response - The search court response.
   * @returns An array of select options.
   */
  private mapSearchCourtToSelectOptions(response: ISearchCourt[]): IGovUkSelectOptions[] {
    return response.map((item: ISearchCourt) => {
      return {
        value: item.courtId,
        name: item.name,
      };
    });
  }

  /**
   * Handles the form submission for account enquiry search.
   * @param formData - The form data containing the search parameters.
   */
  public handleFormSubmit(formData: IAccountEnquiryStateSearch): void {
    this.stateService.accountEnquiry.set({
      search: formData,
    });

    this.router.navigate([AccountEnquiryRoutes.matches]);
  }
}
