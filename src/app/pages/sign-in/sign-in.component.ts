import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { GovukButtonComponent } from '@components';
import { StateService } from '@services';

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
  public readonly stateService = inject(StateService);
  /**
   * Handles the login button click event.
   */
  public handleLoginButtonClick(): void {
    this.document.location.href = '/sso/login';
  }
}
