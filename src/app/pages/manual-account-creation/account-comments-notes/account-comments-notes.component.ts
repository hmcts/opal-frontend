import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { GovukButtonComponent, GovukCancelLinkComponent } from '@components';
import { ManualAccountCreationRoutes } from '@enums';

@Component({
  selector: 'app-account-comments-notes',
  standalone: true,
  imports: [GovukButtonComponent, GovukCancelLinkComponent],
  templateUrl: './account-comments-notes.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountCommentsNotesComponent {
  private readonly router = inject(Router);

  public readonly manualAccountCreationRoutes = ManualAccountCreationRoutes;

  /**
   * Navigates to the specified route.
   *
   * @param route - The route to navigate to.
   */
  public handleRoute(route: string): void {
    this.router.navigate([route]);
  }
}
