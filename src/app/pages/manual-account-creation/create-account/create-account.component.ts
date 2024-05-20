import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {
  GovukBackLinkComponent,
  GovukButtonComponent,
  GovukTagComponent,
  GovukTaskListComponent,
  GovukTaskListItemComponent,
} from '@components';
import { ManualAccountCreationRoutes } from '@enums';
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
    GovukBackLinkComponent,
  ],
  templateUrl: './create-account.component.html',
})
export class CreateAccountComponent {
  private readonly router = inject(Router);
  private readonly stateService = inject(StateService);
  public readonly manualAccountCreationRoutes = ManualAccountCreationRoutes;
  public readonly stateService = inject(StateService);

  /**
   * Handles back and navigates to the manual account creation page.
   */
  public handleBack(): void {
    console.log(this.stateService.manualAccountCreation);
    this.router.navigate([ManualAccountCreationRoutes.accountDetails]);
  }
}
