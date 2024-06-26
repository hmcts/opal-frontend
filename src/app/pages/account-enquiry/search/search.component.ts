import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CourtService } from '@services';

import {
  IAccountEnquiryStateSearch,
  IAutoCompleteItem,
  IGovUkSelectOptions,
  ISearchCourt,
  ISearchCourtBody,
} from '@interfaces';

import { AccountEnquiryRoutes } from '@enums';
import { Observable, map } from 'rxjs';
import { SearchFormComponent } from './search-form/search-form.component';
import { FormParentBaseComponent } from '@components';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent extends FormParentBaseComponent {
  private readonly courtService = inject(CourtService);
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
  private mapSearchCourtToSelectOptions(response: ISearchCourt[]): IAutoCompleteItem[] {
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
    this.macStateService.accountEnquiry = {
      search: formData,
    };

    this['routerNavigate'](AccountEnquiryRoutes.matches);
  }
}
