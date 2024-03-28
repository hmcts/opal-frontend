import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { GovukButtonComponent } from '@components';

@Component({
  selector: 'app-sign-in-sso',
  standalone: true,
  imports: [CommonModule, GovukButtonComponent],
  templateUrl: './sign-in-sso.component.html',
  styleUrl: './sign-in-sso.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInSsoComponent {
  @Output() private signInButtonClick = new EventEmitter();

  public handleButtonClick(): void {
    this.signInButtonClick.emit();
  }
}
