import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { GovukButtonComponent } from '@components';
import { SignInSsoComponent } from './sign-in-sso/sign-in-sso.component';
import { SignInStubComponent } from './sign-in-stub/sign-in-stub.component';
import { StateService } from '@services';
import { ISignInStubForm } from '@interfaces';

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
    this.document.location.href = '/sso/login';
  }

  public handleStubSignInFormSubmit(formData: ISignInStubForm): void {
    this.document.location.href = `/sso/login?email=${formData.email}`;
  }

  ngOnInit(): void {
    // This is to prevent a load flicker when switching between sso/stub sign in
    this.ssoEnabled = this.stateService.ssoEnabled;
    this.changeDetectorRef.detectChanges();
  }
}
