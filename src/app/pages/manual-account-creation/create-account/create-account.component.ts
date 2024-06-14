import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';

import { Router, RouterModule } from '@angular/router';
import {
  GovukButtonComponent,
  GovukHeadingWithCaptionComponent,
  GovukSummaryListComponent,
  GovukSummaryListRowComponent,
  GovukTagComponent,
  GovukTaskListComponent,
  GovukTaskListItemComponent,
} from '@components';
import { DEFENDANT_TYPES_STATE } from '@constants';
import { ManualAccountCreationRoutes, RoutingPaths } from '@enums';
import { StateService } from '@services';

@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    GovukTagComponent,
    GovukTaskListComponent,
    GovukTaskListItemComponent,
    GovukButtonComponent,
    GovukHeadingWithCaptionComponent,
    GovukSummaryListComponent,
    GovukSummaryListRowComponent,
  ],
  templateUrl: './create-account.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateAccountComponent implements OnInit {
  private readonly router = inject(Router);
  public readonly stateService = inject(StateService);
  public readonly routingPaths = RoutingPaths;
  public readonly manualAccountCreationRoutes = ManualAccountCreationRoutes;

  public readonly defendantTypes = DEFENDANT_TYPES_STATE;

  public defendantType!: string;

  public setDefendantType(): void {
    if (this.stateService.manualAccountCreation.accountDetails.defendantType) {
      const df = this.defendantTypes[this.stateService.manualAccountCreation.accountDetails.defendantType];
      this.defendantType = df;
    }
  }

  /**
   * Handles route with the supplied route
   *
   * @param route string of route
   * Handles route with the supplied route
   *
   * @param route string of route
   */
  public handleRoute(route: string): void {
    this.router.navigate([route]);
  }

  ngOnInit(): void {
    this.setDefendantType();
  }
}
