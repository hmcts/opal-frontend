import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { GovukPanelComponent } from '../../../../components/govuk/govuk-panel/govuk-panel.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FINES_MAC_ROUTING_PATHS } from '../routing/constants/fines-mac-routing-paths';
import { Observable } from 'rxjs';
import { IFinesMacAddAccountPayload } from '../services/fines-mac-payload/interfaces/fines-mac-payload-add-account.interfaces';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { GlobalStateService } from '@services/global-state-service/global-state.service';
import { FinesMacPayloadService } from '../services/fines-mac-payload/fines-mac-payload.service';
import { CommonModule } from '@angular/common';
import { FINES_CAV_ROUTING_PATHS } from '../../fines-cav/routing/constants/fines-cav-routing-path';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';

@Component({
  selector: 'app-fines-mac-submit-confirmation',
  standalone: true,
  imports: [CommonModule, GovukPanelComponent],
  templateUrl: './fines-mac-submit-confirmation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacSubmitConfirmationComponent {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  protected readonly globalStateService = inject(GlobalStateService);
  protected readonly opalFinesService = inject(OpalFines);
  protected readonly finesService = inject(FinesService);
  private readonly finesMacPayloadService = inject(FinesMacPayloadService);

  private readonly finesRoutes = FINES_ROUTING_PATHS;
  private readonly finesMacRoutes = FINES_MAC_ROUTING_PATHS;
  private readonly finesCavRoutes = FINES_CAV_ROUTING_PATHS;
  private readonly finesMacState = this.finesService.finesMacState;
  private readonly userState = this.globalStateService.userState();
  private readonly finesMacAddAccountPayload = this.finesMacPayloadService.buildAddAccountPayload(
    this.finesMacState,
    this.userState,
  );

  public draftAddAccountPayload$: Observable<IFinesMacAddAccountPayload> =
    this.opalFinesService.postDraftAddAccountPayload(this.finesMacAddAccountPayload);

  /**
   * Navigates to the create account route within the fines MAC flow.
   *
   * This method uses the Angular Router to navigate to the 'createAccount' route
   * defined in the `finesMacRoutes` configuration. The navigation is relative to
   * the parent of the current activated route.
   *
   * @returns {void}
   */
  public createNewAccount(): void {
    this.router.navigate([this.finesMacRoutes.children.createAccount], { relativeTo: this.activatedRoute.parent });
  }

  /**
   * Navigates to the accounts page.
   * This method uses the Angular Router to navigate to the route specified
   * in `finesCavRoutes.children.accounts`.
   */
  public seeAllAccounts(): void {
    this.router.navigate([
      `${this.finesRoutes.root}/${this.finesCavRoutes.root}/${this.finesCavRoutes.children.accounts}`,
    ]);
  }
}
