import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FINES_SA_SEARCH_ROUTING_PATHS } from '../routing/constants/fines-sa-search-routing-paths.constant';
import { FinesSaStore } from '../../stores/fines-sa.store';

@Component({
  selector: 'app-fines-sa-search-problem',
  templateUrl: './fines-sa-search-problem.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesSaSearchProblemComponent {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly finesSaStore = inject(FinesSaStore);
  private readonly finesSaSearchRoutingPaths = FINES_SA_SEARCH_ROUTING_PATHS;

  /**
   * Navigates the user back to the root path of the fines search section.
   * Utilizes Angular's Router to perform navigation relative to the parent route
   * of the current ActivatedRoute.
   */
  public goBack(): void {
    this.router.navigate([this.finesSaSearchRoutingPaths.root], {
      relativeTo: this.activatedRoute.parent,
      fragment: this.finesSaStore.activeTab(),
    });
  }
}
