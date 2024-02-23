import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CourtService, StateService } from '@services';

import { IAccountEnquiryStateSearch, IGovUkSelectOptions, ISearchCourt, ISearchCourtBody } from '@interfaces';

import { AccountEnquiryRoutes } from '@enums';
import { Observable, map } from 'rxjs';
import { SearchFormComponent } from './search-form/search-form.component';

@Component({
  selector: 'app-account-enquiry',
  standalone: true,
  imports: [CommonModule, RouterModule, SearchFormComponent],
  providers: [CourtService],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent {
  private readonly router = inject(Router);
  private readonly courtService = inject(CourtService);
  public readonly stateService = inject(StateService);

  private readonly searchCourtBody: ISearchCourtBody = {
    courtId: null,
    courtCode: null,
    parentCourtId: null,
    localJusticeAreaId: null,
    nationalCourtCode: null,
  };

  public data$: Observable<IGovUkSelectOptions[]> = this.courtService.searchCourt(this.searchCourtBody).pipe(
    map((response: ISearchCourt[]) => {
      return response.map((item: ISearchCourt) => {
        return {
          value: item.courtId,
          name: item.name,
        };
      });
    }),
  );

  public handleFormSubmit(formData: IAccountEnquiryStateSearch): void {
    this.stateService.accountEnquiry.set({
      search: formData,
    });

    this.router.navigate([AccountEnquiryRoutes.matches]);
  }
}
