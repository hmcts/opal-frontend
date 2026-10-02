import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FINES_ROUTING_PATHS } from '@app/flows/fines/routing/constants/fines-routing-paths.constant';
import { FINES_DASHBOARD_ROUTING_PATHS } from '@app/flows/fines/constants/fines-dashboard-routing-paths.constant';

@Component({
  selector: 'app-fines-mci-create-allocate',
  imports: [RouterLink],
  templateUrl: './fines-mci-create-allocate.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMciCreateAllocateComponent {
  protected readonly financeDashboardRoute = [
    '/',
    FINES_ROUTING_PATHS.root,
    FINES_DASHBOARD_ROUTING_PATHS.root,
    FINES_DASHBOARD_ROUTING_PATHS.children.finance,
  ];
}
