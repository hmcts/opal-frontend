import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { GovukHeadingWithCaptionComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-heading-with-caption';
import { IOpalFinesAlternatePaymentReferencesResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-alternate-payment-reference.interface';
import { FinesAccountStore } from '../stores/fines-acc.store';
import { FinesAccBannerMessagesComponent } from '../fines-acc-banner-messages/fines-acc-banner-messages.component';
import { FinesAccAlternatePaymentReferenceTableComponent } from '../fines-acc-defendant-alternate-payment-reference/fines-acc-alternate-payment-reference-table.component';
import { canAddAlternatePaymentReference } from '../fines-acc-defendant-alternate-payment-reference/fines-acc-alternate-payment-reference.utils';

@Component({
  selector: 'app-fines-acc-defendant-alternate-payment-reference-list',
  imports: [
    RouterLink,
    GovukHeadingWithCaptionComponent,
    FinesAccBannerMessagesComponent,
    FinesAccAlternatePaymentReferenceTableComponent,
  ],
  templateUrl: './fines-acc-defendant-alternate-payment-reference-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccDefendantAlternatePaymentReferenceListComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly routeData = toSignal(this.route.data, { initialValue: this.route.snapshot.data });
  private readonly data = computed(
    () => this.routeData()['alternatePaymentReferences'] as IOpalFinesAlternatePaymentReferencesResponse,
  );
  public readonly accountStore = inject(FinesAccountStore);
  public readonly currentReferences = computed(() =>
    this.data().references.filter((reference) => reference.category === 'APR' && reference.relationship === 'APR'),
  );
  public readonly consolidatedReferences = computed(() =>
    this.data().references.filter((reference) => reference.category === 'APR' && reference.relationship !== 'APR'),
  );
  public readonly canAdd = computed(() => canAddAlternatePaymentReference(this.data().references));
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
}
