import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { PermissionsService } from '@hmcts/opal-frontend-common/services/permissions-service';
import { OpalStubService } from '@services/fines/opal-stub-service/opal-stub.service';
import { FINES_DRAFT_CREATE_AND_MANAGE_ROUTING_PATHS } from '../../flows/fines/fines-draft/fines-draft-create-and-manage/routing/constants/fines-draft-create-and-manage-routing-paths.constant';
import { FINES_DRAFT_CHECK_AND_VALIDATE_ROUTING_PATHS } from '../../flows/fines/fines-draft/fines-draft-check-and-validate/routing/constants/fines-draft-check-and-validate-routing-paths.constant';
import { FINES_SA_SEARCH_ROUTING_PATHS } from '../../flows/fines/fines-sa/fines-sa-search/routing/constants/fines-sa-search-routing-paths.constant';
import { FINES_PERMISSIONS } from '../../constants/fines-permissions.constant';
import { catchError, of, tap } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  imports: [RouterModule],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  private readonly permissionService = inject(PermissionsService);
  private readonly opalStubService = inject(OpalStubService);

  public readonly globalStore = inject(GlobalStore);
  public readonly permissionIds = this.permissionService.getUniquePermissions(this.globalStore.userState());
  public readonly dashboardPermissions = FINES_PERMISSIONS;
  public readonly finesRoutingPaths = FINES_ROUTING_PATHS;
  public readonly finesDraftCreateAndManageRoutingPaths = FINES_DRAFT_CREATE_AND_MANAGE_ROUTING_PATHS;
  public readonly finesDraftCheckAndValidateRoutingPaths = FINES_DRAFT_CHECK_AND_VALIDATE_ROUTING_PATHS;
  public readonly finesSaSearchRoutingPaths = FINES_SA_SEARCH_ROUTING_PATHS;
  public active: string = 'nav1';

  public ngOnInit(): void {
    this.opalStubService
      .postLegacyOpal(
        'getNote',
        {},
        {
          accept: 'application/xml',
          parseXmlToJson: true,
        },
      )
      .pipe(
        tap((result) => {
          console.log(result);
        }),
        catchError(() => of(null)),
      )
      .subscribe();
  }
}
