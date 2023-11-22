import { Component, inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { GovukButtonComponent } from '@components';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, GovukButtonComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly document = inject(DOCUMENT);

  public handleLoginButtonClick(): void {
    this.document.location.href = '/sso/login';
  }
}
