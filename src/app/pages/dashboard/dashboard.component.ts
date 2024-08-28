import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FINES_ROUTING_PATHS } from '@constants/fines';
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
  public readonly finesRoutingPaths = FINES_ROUTING_PATHS;

  public active: string = 'nav1';
}
