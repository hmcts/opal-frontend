import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { GovukBackLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-back-link';
import { FINES_ROUTING_PATHS } from '@app/flows/fines/routing/constants/fines-routing-paths.constant';
import { FINES_SUSPENSE_ITEM_ROUTING_PATHS } from '../routing/constants/fines-suspense-item-routing-paths.constant';

@Component({
  selector: 'app-fines-suspense-item-results',
  imports: [GovukBackLinkComponent],
  templateUrl: './fines-suspense-item-results.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesSuspenseItemResultsComponent {
  private readonly router = inject(Router);

  public navigateBackToSearch(): void {
    void this.router.navigate([
      '/',
      FINES_ROUTING_PATHS.root,
      FINES_SUSPENSE_ITEM_ROUTING_PATHS.root,
      FINES_SUSPENSE_ITEM_ROUTING_PATHS.children.search,
    ]);
  }
}
