import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { GovukPanelComponent } from '../../../../components/govuk/govuk-panel/govuk-panel.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FINES_MAC_ROUTING_PATHS } from '../routing/constants/fines-mac-routing-paths';

@Component({
  selector: 'app-fines-mac-submit-confirmation',
  standalone: true,
  imports: [GovukPanelComponent],
  templateUrl: './fines-mac-submit-confirmation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacSubmitConfirmationComponent {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  private readonly finesMacRoutes = FINES_MAC_ROUTING_PATHS;

  public createNewAccount(): void {
    this.router.navigate([this.finesMacRoutes.children.createAccount], { relativeTo: this.activatedRoute.parent });
  }
}
