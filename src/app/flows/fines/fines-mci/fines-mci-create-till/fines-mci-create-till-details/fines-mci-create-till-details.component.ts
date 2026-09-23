import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FINES_ROUTING_PATHS } from '@app/flows/fines/routing/constants/fines-routing-paths.constant';
import { GovukBackLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-back-link';
import { GovukButtonComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-button';
import {
  GovukSummaryListComponent,
  GovukSummaryListRowComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-summary-list';
import { FINES_MCI_ROUTING_PATHS } from '../../routing/constants/fines-mci-routing-paths.constant';
import { FinesMciStore } from '../../stores/fines-mci.store';

@Component({
  selector: 'app-fines-mci-create-till-details',
  imports: [
    GovukBackLinkComponent,
    GovukButtonComponent,
    GovukSummaryListComponent,
    GovukSummaryListRowComponent,
  ],
  templateUrl: './fines-mci-create-till-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMciCreateTillDetailsComponent {
  private readonly router = inject(Router);
  protected readonly finesMciStore = inject(FinesMciStore);

  private navigateTo(path: string): void {
    void this.router.navigate(['/', FINES_ROUTING_PATHS.root, FINES_MCI_ROUTING_PATHS.root, path]);
  }

  public navigateBack(): void {
    this.finesMciStore.reset();
    this.navigateTo(FINES_MCI_ROUTING_PATHS.children.createAllocate);
  }

  public addPayment(): void {
    this.navigateTo(FINES_MCI_ROUTING_PATHS.children.createTillPaymentCategory);
  }

  public cancel(event: Event): void {
    event.preventDefault();
    this.navigateTo(FINES_MCI_ROUTING_PATHS.children.createTillCancel);
  }
}
