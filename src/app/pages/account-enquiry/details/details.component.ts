import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  GovukButtonComponent,
  GovukSummaryListComponent,
  GovukSummaryListRowComponent,
  GovukTabListItemComponent,
  GovukTabPanelComponent,
  GovukTabsComponent,
} from '@components';

import { AccountEnquiryRoutes } from '@enums';
import { DefendantAccountService } from '@services';
import { EMPTY, Observable } from 'rxjs';
import { IDefendantAccountDetails } from '@interfaces';

@Component({
  selector: 'app-account-enquiry-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    GovukTabsComponent,
    GovukTabListItemComponent,
    GovukTabPanelComponent,
    GovukSummaryListComponent,
    GovukSummaryListRowComponent,
    GovukButtonComponent,
  ],
  providers: [DefendantAccountService],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly defendantAccountService = inject(DefendantAccountService);
  private readonly route = inject(ActivatedRoute);

  public data$: Observable<IDefendantAccountDetails> = EMPTY;

  /**
   * Performs the initial setup for the details component.
   * Retrieves the defendantAccountId from the route params and fetches the defendant account details.
   */
  private initialSetup(): void {
    this.route.params.subscribe((params) => {
      const defendantAccountId = params['defendantAccountId']; // get defendantAccountId from route params
      this.data$ = this.defendantAccountService.getDefendantAccountDetails(defendantAccountId);
    });
  }

  /**
   * Navigates to the matches page when the back button is clicked.
   */
  public handleBack(): void {
    this.router.navigate([AccountEnquiryRoutes.matches]);
  }

  ngOnInit() {
    this.initialSetup();
  }
}
