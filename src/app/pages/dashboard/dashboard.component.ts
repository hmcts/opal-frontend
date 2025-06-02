import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { PermissionsService } from '@hmcts/opal-frontend-common/services/permissions-service';
import { DashboardPermissions } from './enums/dashboard-permissions.enum';
import { FINES_DRAFT_CREATE_AND_MANAGE_ROUTING_PATHS } from '../../flows/fines/fines-draft/fines-draft-create-and-manage/routing/constants/fines-draft-create-and-manage-routing-paths.constant';
import { FINES_DRAFT_CHECK_AND_VALIDATE_ROUTING_PATHS } from 'src/app/flows/fines/fines-draft/fines-draft-check-and-validate/routing/constants/fines-draft-check-and-validate-routing-paths.constant';
import { MojAlertComponent } from '@hmcts/opal-frontend-common/components/moj/moj-alert';

@Component({
  selector: 'app-dashboard',
  imports: [RouterModule, MojAlertComponent],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  public readonly globalStore = inject(GlobalStore);
  private readonly permissionService = inject(PermissionsService);
  public readonly permissionIds = this.permissionService.getUniquePermissions(this.globalStore.userState());
  public readonly permissionsMap = DashboardPermissions;
  public readonly finesRoutingPaths = FINES_ROUTING_PATHS;
  public readonly finesDraftCreateAndManageRoutingPaths = FINES_DRAFT_CREATE_AND_MANAGE_ROUTING_PATHS;
  public readonly finesDraftCheckAndValidateRoutingPaths = FINES_DRAFT_CHECK_AND_VALIDATE_ROUTING_PATHS;

  public active: string = 'nav1';
}
