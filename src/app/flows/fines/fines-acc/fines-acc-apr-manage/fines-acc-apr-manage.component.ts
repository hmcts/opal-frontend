import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { GovukBackLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-back-link';
import { GovukHeadingWithCaptionComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-heading-with-caption';
import { FinesAccountStore } from '../stores/fines-acc.store';

@Component({
  selector: 'app-fines-acc-apr-manage',
  imports: [GovukBackLinkComponent, GovukHeadingWithCaptionComponent],
  templateUrl: './fines-acc-apr-manage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccAprManageComponent {
  private readonly router = inject(Router);
  public readonly accountStore = inject(FinesAccountStore);
  public readonly accountCaption = computed(
    () => `${this.accountStore.getAccountNumber()} - ${this.accountStore.party_name()}`,
  );
  public readonly accountDetails = computed(() => `/fines/account/defendant/${this.accountStore.account_id()}/details`);

  public navigateBack(): void {
    void this.router.navigate([this.accountDetails()], { fragment: 'payment-terms' });
  }
}
