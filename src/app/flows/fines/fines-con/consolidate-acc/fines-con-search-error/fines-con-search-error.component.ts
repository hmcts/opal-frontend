import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinesConDefendant } from '../../types/fines-con-defendant.type';
import { FinesConStore } from '../../stores/fines-con.store';
import { Router, ActivatedRoute } from '@angular/router';
import { FINES_CON_ROUTING_PATHS } from '../../routing/constants/fines-con-routing-paths.constant';

@Component({
  selector: 'app-fines-con-search-error',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fines-con-search-error.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesConSearchErrorComponent {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly finesConStore = inject(FinesConStore);

  /**
   * Gets the current defendant type from the consolidation store.
   */
  public get defendantType(): FinesConDefendant {
    return this.finesConStore.getDefendantType() as FinesConDefendant;
  }

  /**
   * Navigates back to the consolidate accounts page (Search tab).
   */
  public goBack(event: Event): void {
    event.preventDefault();
    this.router.navigate([FINES_CON_ROUTING_PATHS.children.consolidateAcc], {
      relativeTo: this.activatedRoute.parent,
      fragment: 'search',
    });
  }
}
