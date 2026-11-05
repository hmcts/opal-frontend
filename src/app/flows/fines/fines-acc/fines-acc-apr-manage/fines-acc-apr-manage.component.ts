import { ChangeDetectionStrategy, Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Subject, takeUntil } from 'rxjs';
import { GovukBackLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-back-link';
import { GovukButtonComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-button';
import { GovukHeadingWithCaptionComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-heading-with-caption';
import { IOpalFinesAprsResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-apr.interface';
import { FinesAccountStore } from '../stores/fines-acc.store';
import { FinesAccBannerMessagesComponent } from '../fines-acc-banner-messages/fines-acc-banner-messages.component';
import { FinesAccAprManageTableComponent } from './fines-acc-apr-manage-table/fines-acc-apr-manage-table.component';
import { FinesAccPayloadService } from '../services/fines-acc-payload.service';
import { IFinesAccAprManageData } from './interfaces/fines-acc-apr-manage-data.interface';

@Component({
  selector: 'app-fines-acc-apr-manage',
  imports: [
    GovukBackLinkComponent,
    GovukButtonComponent,
    GovukHeadingWithCaptionComponent,
    FinesAccBannerMessagesComponent,
    FinesAccAprManageTableComponent,
  ],
  templateUrl: './fines-acc-apr-manage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccAprManageComponent implements OnInit, OnDestroy {
  private readonly ngUnsubscribe = new Subject<void>();
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly payloadService = inject(FinesAccPayloadService);
  private readonly data = signal<IFinesAccAprManageData | null>(null);
  public readonly accountStore = inject(FinesAccountStore);
  public readonly currentReferences = computed(() => this.data()?.currentReferences ?? []);
  public readonly consolidatedReferences = computed(() => this.data()?.consolidatedReferences ?? []);
  public readonly canAdd = computed(() => this.data()?.canAdd ?? false);
  public readonly successMessage = signal<string | null>(null);
  public readonly accountCaption = computed(
    () => `${this.accountStore.getAccountNumber()} - ${this.accountStore.party_name()}`,
  );
  public readonly accountDetails = computed(() => `/fines/account/defendant/${this.accountStore.account_id()}/details`);

  public navigateBack(): void {
    void this.router.navigate([this.accountDetails()], { fragment: 'payment-terms' });
  }

  public navigateToAdd(): void {
    void this.router.navigate(['../add'], { relativeTo: this.route });
  }

  public ngOnInit(): void {
    this.route.data
      .pipe(
        map((data) => this.payloadService.transformAprsPayload(data['aprs'] as IOpalFinesAprsResponse)),
        takeUntil(this.ngUnsubscribe),
      )
      .subscribe((data) => {
        this.data.set(data);
        this.successMessage.set(this.accountStore.successMessage());
        this.accountStore.clearSuccessMessage();
      });
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
