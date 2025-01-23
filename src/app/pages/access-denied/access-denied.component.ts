import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { GovukButtonComponent } from '@components/govuk/govuk-button/govuk-button.component';

@Component({
  selector: 'app-access-denied',

  imports: [GovukButtonComponent],
  templateUrl: './access-denied.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccessDeniedComponent {
  private readonly router = inject(Router);

  public handleGoBackButtonClick(): void {
    // For now, test page will act as our 'Dashboard' page
    this.router.navigate(['/']);
  }
}
