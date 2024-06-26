import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AccountEnquiryRoutes, ManualAccountCreationRoutes } from '@enums';
import { GlobalStateService } from '@services';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  public readonly globalStateService = inject(GlobalStateService);
  public readonly manualAccountCreationRoutes = ManualAccountCreationRoutes;
  public readonly accountEnquiryRoutes = AccountEnquiryRoutes;
}
