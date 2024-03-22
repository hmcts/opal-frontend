import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { GovukButtonComponent } from '@components';

@Component({
  selector: 'app-access-denied',
  standalone: true,
  imports: [GovukButtonComponent],
  templateUrl: './access-denied.component.html',
  styleUrl: './access-denied.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccessDeniedComponent {
  private readonly router = inject(Router);

  public handleGoBackButtonClick(): void {
    // For now, test page will act as our 'Dashboard' page
    this.router.navigate(['/test-page']);
  }
}
