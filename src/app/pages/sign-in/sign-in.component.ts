import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { GovukButtonComponent } from '@components';
import { SignInSsoComponent } from './sign-in-sso/sign-in-sso.component';
import { SignInStubComponent } from './sign-in-stub/sign-in-stub.component';
import { StateService } from '@services';
import { ISignInStubForm } from '@interfaces';
import { SsoEndpoints } from '@enums';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, GovukButtonComponent, SignInSsoComponent, SignInStubComponent],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInComponent implements OnInit {
  public readonly stateService = inject(StateService);
  public ssoEnabled: boolean | null = true;
  private readonly document = inject(DOCUMENT);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  /**
   * Handles the login button click event.
   */
  public handleSsoSignInButtonClick(): void {
    this.document.location.href = SsoEndpoints.login;
  }

  /**
   * Handles the submission of the stub sign-in form.
   * Redirects the user to the SSO login page with the provided email.
   * @param formData - The form data containing the email.
   */
  public handleStubSignInFormSubmit(formData: ISignInStubForm): void {
    this.document.location.href = `${SsoEndpoints.login}?email=${formData.email}`;
  }

  ngOnInit(): void {
    // This is to prevent a load flicker when switching between sso/stub sign in
    this.ssoEnabled = this.stateService.ssoEnabled;
    this.changeDetectorRef.detectChanges();
  }
}
