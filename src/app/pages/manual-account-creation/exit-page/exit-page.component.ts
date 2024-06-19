import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { GovukButtonComponent } from '@components';
import { MANUAL_ACCOUNT_CREATION_EXIT_ROUTES } from '@constants';

@Component({
  selector: 'app-exit-page',
  standalone: true,
  imports: [GovukButtonComponent],
  templateUrl: './exit-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExitPageComponent {
  constructor(private router: Router) {
    const finalUrl = this.router.getCurrentNavigation()?.previousNavigation?.finalUrl;
    this.finalUrl = finalUrl ? finalUrl.toString() : '';
  }
  public finalUrl!: string;

  /**
   * Handles the click event when the 'Ok' button is clicked.
   * Navigates to the corresponding route based on the final URL.
   */
  public handleOkClick(): void {
    // For now, test page will act as our 'Dashboard' page
    this.router.navigate([MANUAL_ACCOUNT_CREATION_EXIT_ROUTES[this.finalUrl]], { replaceUrl: true });
  }

  /**
   * Handles the click event when the cancel button is clicked.
   * Navigates to the final URL, replacing the current URL in the browser history.
   */
  public handleCancelClick(): void {
    // For now, test page will act as our 'Dashboard' page
    this.router.navigate([this.finalUrl], { replaceUrl: true });
  }
}
