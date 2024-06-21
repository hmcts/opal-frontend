import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { GovukButtonComponent } from '@components';
import {
  MANUAL_ACCOUNT_CREATION_ACCOUNT_DETAILS_FIELDS,
  MANUAL_ACCOUNT_CREATION_EMPLOYER_DETAILS_FIELDS,
} from '@constants';
import { StateService } from '@services';

@Component({
  selector: 'app-exit-page',
  standalone: true,
  imports: [GovukButtonComponent],
  templateUrl: './exit-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExitPageComponent {
  public finalUrl!: string;

  constructor(
    @Inject(Router) private readonly router: Router,
    public stateService: StateService,
  ) {
    const finalUrl = this.router.getCurrentNavigation()?.previousNavigation?.finalUrl;
    this.finalUrl = finalUrl ? finalUrl.toString() : '';
  }

  /**
   * Handles the click event when the "Ok" button is clicked.
   * Sets the snapshot form data for account details and employer details,
   * and navigates to the target URL specified in the manual account creation state.
   */
  public handleOkClick(): void {
    const { accountDetails, employerDetails } = this.stateService.manualAccountCreation;
    accountDetails.snapshotFormData = MANUAL_ACCOUNT_CREATION_ACCOUNT_DETAILS_FIELDS;
    employerDetails.snapshotFormData = MANUAL_ACCOUNT_CREATION_EMPLOYER_DETAILS_FIELDS;

    this.router.navigate([this.stateService.manualAccountCreation.targetUrl], { replaceUrl: true });
  }

  /**
   * Handles the cancel button click event.
   * Navigates to the final URL with replaceUrl set to true.
   */
  public handleCancelClick(): void {
    this.router.navigate([this.finalUrl], { replaceUrl: true });
  }
}
