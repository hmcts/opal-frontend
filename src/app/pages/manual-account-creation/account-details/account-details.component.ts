import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { GovukBackLinkComponent, GovukButtonComponent } from '@components';
import { ManualAccountCreationRoutes, RoutingPaths } from '@enums';

@Component({
  selector: 'app-account-details',
  standalone: true,
  imports: [CommonModule, RouterModule, GovukBackLinkComponent, GovukButtonComponent],
  templateUrl: './account-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountDetailsComponent {
  private readonly router = inject(Router);

  /**
   * Handles continue and navigates to the create account page.
   */
  public handleCreateAccount(): void {
    this.router.navigate([ManualAccountCreationRoutes.createAccount]);
  }

  /**
   * Handles back and navigates to the dashboard page.
   */
  public handleBack(): void {
    this.router.navigate([RoutingPaths.dashboard]);
  }
}
