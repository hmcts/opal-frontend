import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { GovukButtonComponent } from '@components';

@Component({
  selector: 'app-sign-in-sso',
  standalone: true,
  imports: [CommonModule, GovukButtonComponent],
  templateUrl: './sign-in-sso.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInSsoComponent {
  @Output() private signInButtonClick = new EventEmitter();

  /**
   * Handles the button click event.
   * Emits the `signInButtonClick` event.
   */
  public handleButtonClick(): void {
    this.signInButtonClick.emit();
  }
}
