import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ManualAccountCreationRoutes, RoutingPaths } from '@enums';
import { StateService } from '@services';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  public readonly stateService = inject(StateService);
  public readonly manualAccountCreationRoutes = ManualAccountCreationRoutes;
  public readonly routingPaths = RoutingPaths;
}
