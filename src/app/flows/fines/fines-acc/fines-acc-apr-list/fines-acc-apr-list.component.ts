import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { GovukBackLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-back-link';
import { GovukButtonComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-button';
import { GovukHeadingWithCaptionComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-heading-with-caption';
import { IOpalFinesAprsResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-apr.interface';
import { FinesAccountStore } from '../stores/fines-acc.store';
import { FinesAccBannerMessagesComponent } from '../fines-acc-banner-messages/fines-acc-banner-messages.component';
import { FinesAccAprTableComponent } from '../fines-acc-apr/fines-acc-apr-table.component';
import { canAddApr } from '../fines-acc-apr/fines-acc-apr.utils';

@Component({
  selector: 'app-fines-acc-apr-list',
  imports: [
    GovukBackLinkComponent,
    GovukButtonComponent,
    GovukHeadingWithCaptionComponent,
    FinesAccBannerMessagesComponent,
    FinesAccAprTableComponent,
  ],
  templateUrl: './fines-acc-apr-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccAprListComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly routeData = toSignal(this.route.data, { initialValue: this.route.snapshot.data });
  private readonly data = computed(() => this.routeData()['aprs'] as IOpalFinesAprsResponse);
  public readonly accountStore = inject(FinesAccountStore);
  public readonly currentReferences = computed(() =>
    this.data().references.filter((reference) => reference.category === 'APR' && reference.relationship === 'APR'),
  );
  public readonly consolidatedReferences = computed(() =>
    this.data().references.filter((reference) => reference.category === 'APR' && reference.relationship !== 'APR'),
  );
  public readonly canAdd = computed(() => canAddApr(this.data().references));
  public readonly successMessage = signal<string | null>(null);
  public readonly accountCaption = computed(
    () => `${this.accountStore.getAccountNumber()} - ${this.accountStore.party_name()}`,
  );
  public readonly accountDetails = computed(() => `/fines/account/defendant/${this.accountStore.account_id()}/details`);

  constructor() {
    this.route.data.pipe(takeUntilDestroyed()).subscribe(() => {
      this.successMessage.set(this.accountStore.successMessage());
      this.accountStore.clearSuccessMessage();
    });
  }
  public navigateBack(): void {
    void this.router.navigate([this.accountDetails()], { fragment: 'payment-terms' });
  }

  public navigateToAdd(): void {
    void this.router.navigate(['../add'], { relativeTo: this.route });
  }
}
