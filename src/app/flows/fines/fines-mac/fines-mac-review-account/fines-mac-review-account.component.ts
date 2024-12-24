import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GovukBackLinkComponent } from '@components/govuk/govuk-back-link/govuk-back-link.component';
import { GovukButtonComponent } from '@components/govuk/govuk-button/govuk-button.component';
import { FINES_MAC_ROUTING_PATHS } from '../routing/constants/fines-mac-routing-paths';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { FinesMacReviewAccountAccountDetailsComponent } from './fines-mac-review-account-account-details/fines-mac-review-account-account-details.component';
import { FinesMacReviewAccountCourtDetailsComponent } from './fines-mac-review-account-court-details/fines-mac-review-account-court-details.component';
import {
  IOpalFinesCourt,
  IOpalFinesCourtRefData,
} from '@services/fines/opal-fines-service/interfaces/opal-fines-court-ref-data.interface';
import { catchError, forkJoin, Observable, of, Subject, takeUntil, tap } from 'rxjs';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { CommonModule } from '@angular/common';
import { FinesMacReviewAccountPersonalDetailsComponent } from './fines-mac-review-account-personal-details/fines-mac-review-account-personal-details.component';
import { FinesMacReviewAccountContactDetailsComponent } from './fines-mac-review-account-contact-details/fines-mac-review-account-contact-details.component';
import { FinesMacReviewAccountEmployerDetailsComponent } from './fines-mac-review-account-employer-details/fines-mac-review-account-employer-details.component';
import { FinesMacReviewAccountPaymentTermsComponent } from './fines-mac-review-account-payment-terms/fines-mac-review-account-payment-terms.component';
import { FinesMacReviewAccountAccountCommentsAndNotesComponent } from './fines-mac-review-account-account-comments-and-notes/fines-mac-review-account-account-comments-and-notes.component';
import { FinesMacReviewAccountOffenceDetailsComponent } from './fines-mac-review-account-offence-details/fines-mac-review-account-offence-details.component';
import {
  IOpalFinesLocalJusticeArea,
  IOpalFinesLocalJusticeAreaRefData,
} from '@services/fines/opal-fines-service/interfaces/opal-fines-local-justice-area-ref-data.interface';
import { FinesMacReviewAccountParentGuardianDetailsComponent } from './fines-mac-review-account-parent-guardian-details/fines-mac-review-account-parent-guardian-details.component';
import { FinesMacReviewAccountCompanyDetailsComponent } from './fines-mac-review-account-company-details/fines-mac-review-account-company-details.component';
import { IOpalFinesBusinessUnit } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit-ref-data.interface';
import { UtilsService } from '@services/utils/utils.service';
import { FINES_DRAFT_TAB_STATUSES } from '../../fines-draft/constants/fines-draft-tab-statuses.constant';
import { DateService } from '@services/date-service/date.service';
import { FINES_DRAFT_CAM_ROUTING_PATHS } from '../../fines-draft/fines-draft-cam/routing/constants/fines-draft-cam-routing-paths.constant';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { GovukTagComponent } from '@components/govuk/govuk-tag/govuk-tag.component';
import { MojTimelineItemComponent } from '@components/moj/moj-timeline/moj-timeline-item/moj-timeline-item.component';
import { MojTimelineComponent } from '@components/moj/moj-timeline/moj-timeline.component';
import { FinesMacPayloadService } from '../services/fines-mac-payload/fines-mac-payload.service';
import { GlobalStateService } from '@services/global-state-service/global-state.service';
import { IFinesMacAddAccountPayload } from '../services/fines-mac-payload/interfaces/fines-mac-payload-add-account.interfaces';

@Component({
  selector: 'app-fines-mac-review-account',
  standalone: true,
  imports: [
    CommonModule,
    GovukBackLinkComponent,
    GovukButtonComponent,
    FinesMacReviewAccountAccountDetailsComponent,
    FinesMacReviewAccountCourtDetailsComponent,
    FinesMacReviewAccountPersonalDetailsComponent,
    FinesMacReviewAccountContactDetailsComponent,
    FinesMacReviewAccountEmployerDetailsComponent,
    FinesMacReviewAccountPaymentTermsComponent,
    FinesMacReviewAccountAccountCommentsAndNotesComponent,
    FinesMacReviewAccountOffenceDetailsComponent,
    FinesMacReviewAccountParentGuardianDetailsComponent,
    FinesMacReviewAccountCompanyDetailsComponent,
    GovukTagComponent,
    MojTimelineComponent,
    MojTimelineItemComponent,
  ],
  templateUrl: './fines-mac-review-account.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacReviewAccountComponent implements OnInit, OnDestroy {
  private readonly ngUnsubscribe = new Subject<void>();
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  protected readonly globalStateService = inject(GlobalStateService);
  private readonly opalFinesService = inject(OpalFines);
  protected readonly finesService = inject(FinesService);
  protected readonly utilsService = inject(UtilsService);
  protected readonly dateService = inject(DateService);
  private readonly finesMacPayloadService = inject(FinesMacPayloadService);
  private readonly userState = this.globalStateService.userState();

  protected enforcementCourtsData!: IOpalFinesCourt[];
  protected localJusticeAreasData!: IOpalFinesLocalJusticeArea[];

  protected readonly finesRoutes = FINES_ROUTING_PATHS;
  protected readonly finesMacRoutes = FINES_MAC_ROUTING_PATHS;
  protected readonly finesDraftRoutes = FINES_DRAFT_CAM_ROUTING_PATHS;

  private readonly enforcementCourtsData$: Observable<IOpalFinesCourtRefData> = this.opalFinesService
    .getCourts(this.finesService.finesMacState.businessUnit.business_unit_id)
    .pipe(
      tap((response: IOpalFinesCourtRefData) => {
        this.enforcementCourtsData = response.refData;
      }),
    );

  private readonly localJusticeAreasData$: Observable<IOpalFinesLocalJusticeAreaRefData> = this.opalFinesService
    .getLocalJusticeAreas()
    .pipe(
      tap((response: IOpalFinesLocalJusticeAreaRefData) => {
        this.localJusticeAreasData = response.refData;
      }),
    );

  protected groupLjaAndCourtData$ = forkJoin({
    enforcementCourtsData: this.enforcementCourtsData$,
    localJusticeAreasData: this.localJusticeAreasData$,
  });

  private businessUnit: IOpalFinesBusinessUnit | null = null;
  public isReadOnly!: boolean;
  public status = FINES_DRAFT_TAB_STATUSES.find(
    (status) =>
      this.finesService.finesDraftState.account_status &&
      status.statuses.includes(this.finesService.finesDraftState.account_status),
  )?.prettyName;

  /**
   * Retrieves the business unit from the activated route's snapshot data and assigns it to the component's businessUnit property.
   * If a business unit is found, it updates the finesMacState's businessUnit in the finesService and sets the component to read-only mode.
   *
   * @private
   */
  private getBusinessUnit(): void {
    if (this.activatedRoute.snapshot) {
      this.businessUnit = this.activatedRoute.snapshot.data['businessUnit'];
      if (this.businessUnit) {
        this.finesService.finesMacState.businessUnit = this.businessUnit;
        this.isReadOnly = true;
      }
    }
  }

  /**
   * Sends the provided payload to the server to update the draft account information.
   *
   * @param payload - The payload containing the account information to be updated.
   *
   * The method performs the following actions:
   * - Calls the `putDraftAddAccountPayload` method of `opalFinesService` with the provided payload.
   * - On success, sets a banner message indicating the account has been submitted for review.
   * - Navigates to the inputter route.
   * - On error, scrolls to the top of the page.
   * - The observable completes when `ngUnsubscribe` emits.
   */
  private putPayload(payload: IFinesMacAddAccountPayload): void {
    this.opalFinesService
      .putDraftAddAccountPayload(payload)
      .pipe(
        tap(() => {
          const accountName = payload.account_snapshot?.defendant_name;
          this.finesService.finesDraftBannerMessage.set(`You have submitted ${accountName}'s account for review`);
          this.handleRoute(
            `${this.finesRoutes.root}/${this.finesDraftRoutes.root}/${this.finesDraftRoutes.children.inputter}`,
            false,
            undefined,
            this.finesService.finesDraftFragment(),
          );
        }),
        catchError(() => {
          this.utilsService.scrollToTop();
          return of(null);
        }),
        takeUntil(this.ngUnsubscribe),
      )
      .subscribe();
  }

  /**
   * Submits the payload for adding a fines MAC account.
   *
   * This method builds the payload using the `finesMacPayloadService` and the current state of `finesService` and `userState`.
   * It then posts the payload using `opalFinesService`. If the response is successful, it navigates to the submit confirmation route.
   * Otherwise, it logs an error message.
   *
   * @private
   * @returns {void}
   */
  private submitPayload(): void {
    const finesMacAddAccountPayload = this.finesMacPayloadService.buildReplaceAccountPayload(
      this.finesService.finesMacState,
      this.userState,
    );
    if (this.finesService.finesDraftAmend()) {
      finesMacAddAccountPayload.account_snapshot = this.finesService.finesDraftState.account_snapshot;
      finesMacAddAccountPayload.account_status = this.finesService.finesDraftState.account_status;
      finesMacAddAccountPayload.account_status_date = this.finesService.finesDraftState.account_status_date;
      finesMacAddAccountPayload.created_at = this.finesService.finesDraftState.created_at;
      finesMacAddAccountPayload.draft_account_id = this.finesService.finesDraftState.draft_account_id;
      finesMacAddAccountPayload.submitted_by = this.finesService.finesDraftState.submitted_by;
      finesMacAddAccountPayload.submitted_by_name = this.finesService.finesDraftState.submitted_by_name;
      finesMacAddAccountPayload.timeline_data = [
        ...this.finesService.finesDraftState.timeline_data,
        ...finesMacAddAccountPayload.timeline_data,
      ];
      this.putPayload(finesMacAddAccountPayload);
    }
  }

  /**
   * Navigates back to the previous page
   * Page navigation set to false to trigger the canDeactivate guard
   */
  public navigateBack(): void {
    if (this.isReadOnly) {
      this.handleRoute(
        `${this.finesRoutes.root}/${this.finesDraftRoutes.root}/${this.finesDraftRoutes.children.inputter}`,
        false,
        undefined,
        this.finesService.finesDraftFragment(),
      );
    } else {
      this.handleRoute(this.finesMacRoutes.children.accountDetails);
    }
  }

  /**
   * Submits the current payload for review.
   * This method triggers the submission process by calling the `submitPayload` method.
   */
  public submitForReview(): void {
    this.submitPayload();
  }

  /**
   * Navigates to the specified route.
   *
   * @param route - The route to navigate to.
   */
  public handleRoute(route: string, nonRelative: boolean = false, event?: Event, fragment?: string): void {
    if (event) {
      event.preventDefault();
    }
    if (nonRelative) {
      this.router.navigate([route]);
    } else if (fragment) {
      this.router.navigate([route], { fragment });
    } else {
      if (route === this.finesMacRoutes.children.deleteAccountConfirmation) {
        this.finesService.finesMacState.deleteFromCheckAccount = true;
      }
      this.router.navigate([route], { relativeTo: this.activatedRoute.parent });
    }
  }

  public ngOnInit(): void {
    this.getBusinessUnit();
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();

    this.globalStateService.error.set({
      error: false,
      message: '',
    });
  }
}
