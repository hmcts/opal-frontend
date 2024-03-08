import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { GovukButtonComponent } from '@components';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, GovukButtonComponent],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInComponent {
  private readonly document = inject(DOCUMENT);

  /**
   * Handles the login button click event.
   */
  public handleLoginButtonClick(): void {
    this.document.location.href = '/sso/login';
  }
}
