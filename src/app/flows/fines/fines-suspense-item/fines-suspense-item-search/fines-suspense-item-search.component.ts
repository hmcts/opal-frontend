import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FINES_ROUTING_PATHS } from '@app/flows/fines/routing/constants/fines-routing-paths.constant';
import { FINES_DASHBOARD_ROUTING_PATHS } from '@app/flows/fines/constants/fines-dashboard-routing-paths.constant';

@Component({
  selector: 'app-fines-suspense-item-search',
  imports: [RouterLink],
  templateUrl: './fines-suspense-item-search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesSuspenseItemSearchComponent {
  protected readonly financeDashboardRoute = [
    '/',
    FINES_ROUTING_PATHS.root,
    FINES_DASHBOARD_ROUTING_PATHS.root,
    FINES_DASHBOARD_ROUTING_PATHS.children.finance,
  ];
}
