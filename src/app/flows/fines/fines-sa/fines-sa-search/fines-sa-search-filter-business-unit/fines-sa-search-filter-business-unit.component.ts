import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GovukBackLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-back-link';
import { FINES_SA_ROUTING_PATHS } from '../../routing/constants/fines-sa-routing-paths.constant';
import { FinesSaStore } from '../../stores/fines-sa.store';

@Component({
  selector: 'app-fines-sa-search-filter-business-unit',
  imports: [GovukBackLinkComponent],
  templateUrl: './fines-sa-search-filter-business-unit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesSaSearchFilterBusinessUnitComponent {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly finesSaStore = inject(FinesSaStore);
  private readonly finesSaSearchAccountRoutingPaths = FINES_SA_ROUTING_PATHS;

  /**
   * Navigates back to the search page, restoring the previously active tab via fragment.
   */
  public onBackClick(): void {
    this.router.navigate([this.finesSaSearchAccountRoutingPaths.children.search], {
      relativeTo: this.activatedRoute.parent,
      fragment: this.finesSaStore.activeTab(),
    });
  }
}
