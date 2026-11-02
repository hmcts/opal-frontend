import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { GovukBackLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-back-link';
import { GovukButtonComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-button';
import { GovukHeadingWithCaptionComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-heading-with-caption';
import { IOpalFinesAprsResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-apr.interface';
import { FinesAccountStore } from '../stores/fines-acc.store';
import { FinesAccBannerMessagesComponent } from '../fines-acc-banner-messages/fines-acc-banner-messages.component';
import { FinesAccAprListTableComponent } from './fines-acc-apr-list-table/fines-acc-apr-list-table.component';
import { FinesAccPayloadService } from '../services/fines-acc-payload.service';

@Component({
  selector: 'app-fines-acc-apr-list',
  imports: [
    GovukBackLinkComponent,
    GovukButtonComponent,
    GovukHeadingWithCaptionComponent,
    FinesAccBannerMessagesComponent,
    FinesAccAprListTableComponent,
  ],
  templateUrl: './fines-acc-apr-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccAprListComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly payloadService = inject(FinesAccPayloadService);
  private readonly data = toSignal(
    this.route.data.pipe(
      map((data) => this.payloadService.transformAprsPayload(data['aprs'] as IOpalFinesAprsResponse)),
    ),
    { requireSync: true },
  );
  public readonly accountStore = inject(FinesAccountStore);
  public readonly currentReferences = computed(() => this.data().currentReferences);
  public readonly consolidatedReferences = computed(() => this.data().consolidatedReferences);
  public readonly canAdd = computed(() => this.data().canAdd);
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
