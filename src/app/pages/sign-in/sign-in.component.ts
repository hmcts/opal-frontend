import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { SignInStubComponent } from './sign-in-stub/sign-in-stub.component';
import { ISignInStubForm } from './interfaces';
import { SSO_ENDPOINTS } from '@routing/constants/sso-endpoints.constant';
import { GlobalStore } from 'src/app/stores/global/global.store';

@Component({
  selector: 'app-sign-in',
  imports: [CommonModule, SignInStubComponent],
  templateUrl: './sign-in.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInComponent {
  public readonly globalStore = inject(GlobalStore);
  private readonly document = inject(DOCUMENT);

  /**
   * Handles the submission of the stub sign-in form.
   * Redirects the user to the SSO login page with the provided email.
   * @param formData - The form data containing the email.
   */
  public handleStubSignInFormSubmit(formData: ISignInStubForm): void {
    this.document.location.href = `${SSO_ENDPOINTS.login}?email=${formData.email}`;
  }
}
