import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { GlobalStore } from 'src/app/stores/global/global.store';
import { PermissionsService } from '@services/permissions-service/permissions.service';
import { DashboardPermissions } from './enums/dashboard-permissions.enum';
import { FINES_DRAFT_CHECK_AND_MANAGE_ROUTING_PATHS } from 'src/app/flows/fines/fines-draft/fines-draft-check-and-manage/routing/constants/fines-draft-check-and-manage-routing-paths.constant';

@Component({
  selector: 'app-dashboard',
  imports: [RouterModule],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  public readonly globalStore = inject(GlobalStore);
  private readonly permissionService = inject(PermissionsService);
  public readonly permissionIds = this.permissionService.getUniquePermissions(this.globalStore.userState());
  public readonly permissionsMap = DashboardPermissions;
  public readonly finesRoutingPaths = FINES_ROUTING_PATHS;
  public readonly finesDraftCheckAndManageRoutingPaths = FINES_DRAFT_CHECK_AND_MANAGE_ROUTING_PATHS;

  public active: string = 'nav1';
}
