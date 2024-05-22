import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GovukBackLinkComponent, GovukButtonComponent } from '@components';

@Component({
  selector: 'app-account-details',
  standalone: true,
  imports: [GovukBackLinkComponent, GovukButtonComponent],
  templateUrl: './account-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountDetailsComponent {}
