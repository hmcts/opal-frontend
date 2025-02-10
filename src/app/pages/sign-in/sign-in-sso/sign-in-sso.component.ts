import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { GovukButtonComponent } from '@components/govuk/govuk-button/govuk-button.component';

@Component({
  selector: 'app-sign-in-sso',
  imports: [CommonModule, GovukButtonComponent],
  templateUrl: './sign-in-sso.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInSsoComponent {
  @Output() private readonly signInButtonClick = new EventEmitter();

  /**
   * Handles the button click event.
   * Emits the `signInButtonClick` event.
   */
  public handleButtonClick(): void {
    this.signInButtonClick.emit();
  }
}
