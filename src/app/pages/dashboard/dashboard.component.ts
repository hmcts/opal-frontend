import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { GlobalStateService } from '@services/global-state-service/global-state.service';
import { PermissionsService } from '@services/permissions-service/permissions.service';
import { DashboardPermissions } from './enums/dashboard-permissions.enum';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  public readonly globalStateService = inject(GlobalStateService);
  private readonly permissionService = inject(PermissionsService);
  public permissionIds = this.permissionService.getUniquePermissions(this.globalStateService.userState());
  public readonly permissionsMap = DashboardPermissions;
  public readonly finesRoutingPaths = FINES_ROUTING_PATHS;

  public active: string = 'nav1';
}
