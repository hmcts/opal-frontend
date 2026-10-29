import { ChangeDetectionStrategy, Component, HostListener, inject } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { FINES_ROUTING_PATHS } from '@app/flows/fines/routing/constants/fines-routing-paths.constant';
import { GovukBackLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-back-link';
import { GovukButtonComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-button';
import {
  GovukSummaryListComponent,
  GovukSummaryListRowComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-summary-list';
import { CanDeactivateTypes } from '@hmcts/opal-frontend-common/guards/can-deactivate/types';
import { FINES_MCI_ROUTING_PATHS } from '../../routing/constants/fines-mci-routing-paths.constant';
import { FinesMciStore } from '../../stores/fines-mci.store';

@Component({
  selector: 'app-fines-mci-create-till-details',
  imports: [GovukBackLinkComponent, GovukButtonComponent, GovukSummaryListComponent, GovukSummaryListRowComponent],
  templateUrl: './fines-mci-create-till-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMciCreateTillDetailsComponent {
  private allowIntendedNavigation = false;
  private readonly router = inject(Router);
  protected readonly finesMciStore = inject(FinesMciStore);

  private navigateTo(path: string, extras?: NavigationExtras): void {
    this.allowIntendedNavigation = true;
    void this.router.navigate(
      [
        '/',
        FINES_ROUTING_PATHS.root,
        FINES_MCI_ROUTING_PATHS.root,
        FINES_MCI_ROUTING_PATHS.children.create,
        FINES_MCI_ROUTING_PATHS.children.till,
        path,
      ],
      extras,
    );
  }

  public canDeactivate(): CanDeactivateTypes {
    return this.allowIntendedNavigation;
  }

  @HostListener('window:beforeunload')
  public handleBeforeUnload(): boolean {
    return false;
  }

  public navigateBack(): void {
    this.navigateTo(FINES_MCI_ROUTING_PATHS.children.selectBusinessUnit, { state: { preserveBusinessUnit: true } });
  }

  public addPayment(): void {
    this.navigateTo(FINES_MCI_ROUTING_PATHS.children.paymentCategory);
  }

  public cancel(event: Event): void {
    event.preventDefault();
    this.navigateTo(FINES_MCI_ROUTING_PATHS.children.cancel);
  }
}
