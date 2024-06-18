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

  //private readonly router = inject(Router);

  public finalUrl!: string;

  public handleOkClick(): void {
    // For now, test page will act as our 'Dashboard' page
    this.router.navigate([MANUAL_ACCOUNT_CREATION_EXIT_ROUTES[this.finalUrl]], { replaceUrl: true });
  }

  public handleCancelClick(): void {
    // For now, test page will act as our 'Dashboard' page
    this.router.navigate([this.finalUrl], { replaceUrl: true });
  }
}
