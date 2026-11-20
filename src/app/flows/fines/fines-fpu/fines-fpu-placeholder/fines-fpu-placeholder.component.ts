import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FINES_ROUTING_PATHS } from '../../routing/constants/fines-routing-paths.constant';
import { FINES_DASHBOARD_ROUTING_PATHS } from '../../constants/fines-dashboard-routing-paths.constant';

@Component({
  selector: 'app-fines-fpu-placeholder',
  imports: [RouterLink],
  templateUrl: './fines-fpu-placeholder.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesFpuPlaceholderComponent {
  protected readonly accountsDashboardRoute = [
    '/',
    FINES_ROUTING_PATHS.root,
    FINES_DASHBOARD_ROUTING_PATHS.root,
    FINES_DASHBOARD_ROUTING_PATHS.children.accounts,
  ];
}
