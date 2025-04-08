import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FINES_MAC_ROUTING_PATHS } from '../routing/constants/fines-mac-routing-paths.constant';
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
import { FinesMacPayloadService } from '../services/fines-mac-payload/fines-mac-payload.service';
import { FinesMacStore } from '../stores/fines-mac.store';
import { FINES_DRAFT_TAB_STATUSES } from '../../fines-draft/constants/fines-draft-tab-statuses.constant';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { IFetchMapFinesMacPayload } from '../routing/resolvers/fetch-map-fines-mac-payload-resolver/interfaces/fetch-map-fines-mac-payload.interface';
import { FinesDraftStore } from '../../fines-draft/stores/fines-draft.store';
import { FinesMacReviewAccountHistoryComponent } from './fines-mac-review-account-history/fines-mac-review-account-history.component';
import { IFinesMacAddAccountPayload } from '../services/fines-mac-payload/interfaces/fines-mac-payload-add-account.interfaces';
import { FINES_DRAFT_ROUTING_PATHS } from '../../fines-draft/routing/constants/fines-draft-routing-paths.constant';
import { FINES_DRAFT_CHECK_AND_MANAGE_ROUTING_PATHS } from '../../fines-draft/fines-draft-check-and-manage/routing/constants/fines-draft-check-and-manage-routing-paths.constant';
import { GovukButtonComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-button';
import { GovukBackLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-back-link';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores';
import { UtilsService, DateService } from '@hmcts/opal-frontend-common/services';

@Component({
  selector: 'app-fines-mac-review-account',
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
    FinesMacReviewAccountHistoryComponent,
  ],
  templateUrl: './fines-mac-review-account.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacReviewAccountComponent implements OnInit, OnDestroy {
  private readonly ngUnsubscribe = new Subject<void>();
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  private readonly globalStore = inject(GlobalStore);
  private readonly opalFinesService = inject(OpalFines);
  protected readonly finesMacStore = inject(FinesMacStore);
  protected readonly finesDraftStore = inject(FinesDraftStore);
  private readonly finesMacPayloadService = inject(FinesMacPayloadService);
  protected readonly utilsService = inject(UtilsService);
  private readonly userState = this.globalStore.userState();
  protected readonly dateService = inject(DateService);

  protected enforcementCourtsData!: IOpalFinesCourt[];
  protected localJusticeAreasData!: IOpalFinesLocalJusticeArea[];

  protected readonly finesRoutes = FINES_ROUTING_PATHS;
  protected readonly finesMacRoutes = FINES_MAC_ROUTING_PATHS;
  protected readonly finesDraftRoutes = FINES_DRAFT_ROUTING_PATHS;
  protected readonly finesDraftCheckAndManageRoutes = FINES_DRAFT_CHECK_AND_MANAGE_ROUTING_PATHS;

  public isReadOnly!: boolean;
  public reviewAccountStatus!: string;

  private readonly enforcementCourtsData$: Observable<IOpalFinesCourtRefData> = this.opalFinesService
    .getCourts(this.finesMacStore.getBusinessUnitId())
    .pipe(
      tap((response: IOpalFinesCourtRefData) => {
        this.enforcementCourtsData = response.refData;
      }),
      takeUntil(this.ngUnsubscribe),
    );

  private readonly localJusticeAreasData$: Observable<IOpalFinesLocalJusticeAreaRefData> = this.opalFinesService
    .getLocalJusticeAreas()
    .pipe(
      tap((response: IOpalFinesLocalJusticeAreaRefData) => {
        this.localJusticeAreasData = response.refData;
      }),
      takeUntil(this.ngUnsubscribe),
    );

  protected groupLjaAndCourtData$ = forkJoin({
    enforcementCourtsData: this.enforcementCourtsData$,
    localJusticeAreasData: this.localJusticeAreasData$,
  });

  /**
   * Retrieves the draft account status from the fines service and updates the component's status property.
   * It searches for a matching status in the FINES_DRAFT_TAB_STATUSES array based on the account status.
   * If a matching status is found, the component's status property is set to the pretty name of the matching status.
   * If no matching status is found, the component's status property is set to an empty string.
   *
   * @private
   * @returns {void}
   */
  private setReviewAccountStatus(): void {
    const accountStatus = this.finesDraftStore.getAccountStatus();
    const matchingStatus = FINES_DRAFT_TAB_STATUSES.find((status) => status.statuses.includes(accountStatus));

    this.reviewAccountStatus = matchingStatus?.prettyName ?? '';
  }

  /**
   * Fetches and maps the review account payload from the activated route snapshot.
   *
   * This method retrieves the `reviewAccountFetchMap` data from the route snapshot,
   * updates the `finesMacState` and `finesDraftState` in the `finesService`, and sets
   * the review account status. It also sets the component to read-only mode.
   *
   * @private
   * @returns {void}
   */
  private reviewAccountFetchedMappedPayload(): void {
    const snapshot = this.activatedRoute.snapshot;
    if (!snapshot) return;

    const fetchMap = snapshot.data['reviewAccountFetchMap'] as IFetchMapFinesMacPayload;
    if (!fetchMap) return;

    // Get payload into Fines Mac State
    this.finesMacStore.setFinesMacStore(fetchMap.finesMacState);
    this.finesDraftStore.setFinesDraftState(fetchMap.finesMacDraft);

    // Grab the status from the payload
    this.setReviewAccountStatus();

    this.isReadOnly = true;
  }

  /**
   * Handles the request error by scrolling to the top of the page.
   *
   * @returns {null} Always returns null.
   */
  private handleRequestError(): null {
    this.utilsService.scrollToTop();
    return null;
  }

  /**
   * Handles the PUT request to add an account payload.
   *
   * @param payload - The payload containing the account information to be added.
   *
   * This method sends the payload to the `opalFinesService` to update the draft account information.
   * It processes the response using `processPutResponse` method and handles any errors by scrolling to the top of the page.
   * The request is automatically unsubscribed when the component is destroyed using `takeUntil` with `ngUnsubscribe`.
   */
  private handlePutRequest(payload: IFinesMacAddAccountPayload): void {
    this.opalFinesService
      .putDraftAddAccountPayload(payload)
      .pipe(
        tap((response) => this.processPutResponse(response)),
        catchError(() => {
          return of(this.handleRequestError());
        }),
        takeUntil(this.ngUnsubscribe),
      )
      .subscribe();
  }

  /**
   * Handles the post request to add an account payload.
   *
   * @param payload - The payload containing the account details to be added.
   *
   * This method sends the payload to the `opalFinesService` to post the draft add account payload.
   * It processes the response upon success and handles any errors by scrolling to the top of the page.
   * The request is automatically unsubscribed when the component is destroyed.
   */
  private handlePostRequest(payload: IFinesMacAddAccountPayload): void {
    this.opalFinesService
      .postDraftAddAccountPayload(payload)
      .pipe(
        tap(() => this.processPostResponse()),
        catchError(() => {
          return of(this.handleRequestError());
        }),
        takeUntil(this.ngUnsubscribe),
      )
      .subscribe();
  }

  /**
   * Processes the response from a PUT request and updates the state accordingly.
   *
   * @param response - The response payload from the PUT request containing account details.
   * @param response.account_snapshot - Snapshot of the account details.
   * @param response.account_snapshot.defendant_name - The name of the defendant associated with the account.
   *
   * Updates the fines draft banner message with the defendant's name, sets the state changes and unsaved changes flags to false,
   * and handles routing to the inputter route.
   */
  private processPutResponse(response: IFinesMacAddAccountPayload): void {
    const accountName = response.account_snapshot?.defendant_name;
    this.finesDraftStore.setBannerMessage(`You have submitted ${accountName}'s account for review`);
    this.finesMacStore.resetStateChangesUnsavedChanges();

    this.handleRoute(
      `${this.finesRoutes.root}/${this.finesDraftRoutes.root}/${this.finesDraftRoutes.children.createAndManage}`,
      false,
      undefined,
      this.finesDraftStore.fragment(),
    );
  }

  /**
   * Processes the post response by handling the route to the submit confirmation page.
   * This method is called after a post request is successfully completed.
   * It navigates to the submit confirmation route defined in the finesMacRoutes.
   *
   * @private
   * @returns {void}
   */
  private processPostResponse(): void {
    this.handleRoute(this.finesMacRoutes.children.submitConfirmation);
  }

  /**
   * Prepares the payload for a PUT request to replace an account.
   *
   * This method utilizes the `finesMacPayloadService` to build the payload
   * required for replacing an account. It takes into consideration the current
   * state of fines (`finesMacState`), the draft state of fines (`finesDraftState`),
   * and the user state (`userState`).
   *
   * @returns {IFinesMacAddAccountPayload} The payload for the PUT request.
   */
  private preparePutPayload(): IFinesMacAddAccountPayload {
    return this.finesMacPayloadService.buildReplaceAccountPayload(
      this.finesMacStore.getFinesMacStore(),
      this.finesDraftStore.getFinesDraftState(),
      this.userState,
    );
  }

  /**
   * Prepares the payload for posting account data.
   *
   * This method constructs the payload required to add an account by utilizing
   * the `finesMacPayloadService` to build the payload based on the current state
   * of `finesMacState` and `userState`.
   *
   * @returns {IFinesMacAddAccountPayload} The payload for adding an account.
   */
  private preparePostPayload(): IFinesMacAddAccountPayload {
    return this.finesMacPayloadService.buildAddAccountPayload(this.finesMacStore.getFinesMacStore(), this.userState);
  }

  /**
   * Submits the payload for a PUT request.
   * This method prepares the payload and then handles the PUT request.
   *
   * @private
   */
  private submitPutPayload(): void {
    const payload = this.preparePutPayload();
    this.handlePutRequest(payload);
  }

  /**
   * Submits the post payload by preparing the payload and handling the post request.
   *
   * @private
   * @returns {void}
   */
  private submitPostPayload(): void {
    const payload = this.preparePostPayload();
    this.handlePostRequest(payload);
  }

  /**
   * Submits the payload based on the draft amendment status.
   *
   * If the fines draft amendment is present, it submits the payload using a PUT request.
   * Otherwise, it submits the payload using a POST request.
   *
   * @returns {void}
   */
  public submitPayload(): void {
    if (this.finesDraftStore.amend()) {
      this.submitPutPayload();
    } else {
      this.submitPostPayload();
    }
  }

  /**
   * Navigates back to the previous page
   * Page navigation set to false to trigger the canDeactivate guard
   */
  public navigateBack(): void {
    if (this.isReadOnly) {
      this.finesMacStore.setUnsavedChanges(false);
      this.finesMacStore.setStateChanges(false);
      this.handleRoute(
        `${this.finesRoutes.root}/${this.finesDraftRoutes.root}/${this.finesDraftRoutes.children.createAndManage}/${this.finesDraftCheckAndManageRoutes.children.tabs}`,
        false,
        undefined,
        this.finesDraftStore.fragment(),
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
        this.finesMacStore.setDeleteFromCheckAccount(true);
      }
      this.router.navigate([route], { relativeTo: this.activatedRoute.parent });
    }
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();

    this.globalStore.setError({
      error: false,
      message: '',
    });
  }

  public ngOnInit(): void {
    this.reviewAccountFetchedMappedPayload();
  }
}
