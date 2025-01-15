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
import { FinesMacPayloadService } from '../services/fines-mac-payload/fines-mac-payload.service';
import { GlobalStateService } from '@services/global-state-service/global-state.service';
import { UtilsService } from '@services/utils/utils.service';
import { FINES_DRAFT_TAB_STATUSES } from '../../fines-draft/constants/fines-draft-tab-statuses.constant';
import { DateService } from '@services/date-service/date.service';
import { FINES_DRAFT_CAM_ROUTING_PATHS } from '../../fines-draft/fines-draft-cam/routing/constants/fines-draft-cam-routing-paths.constant';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { GovukTagComponent } from '@components/govuk/govuk-tag/govuk-tag.component';
import { MojTimelineItemComponent } from '@components/moj/moj-timeline/moj-timeline-item/moj-timeline-item.component';
import { MojTimelineComponent } from '@components/moj/moj-timeline/moj-timeline.component';
import { IDraftAccountResolver } from '../routing/resolvers/draft-account-resolver/interfaces/draft-account-resolver.interface';
import { IOpalFinesBusinessUnitNonSnakeCase } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit-ref-data.interface';
import { IOpalFinesOffencesNonSnakeCase } from '@services/fines/opal-fines-service/interfaces/opal-fines-offences-ref-data.interface';
import { IFinesMacAddAccountPayload } from '../services/fines-mac-payload/interfaces/fines-mac-payload-add-account.interfaces';
import { FinesMacBaseComponent } from '../components/abstract/fines-mac-base.component';
import { TransformationService } from '@services/transformation-service/transformation.service';

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
export class FinesMacReviewAccountComponent extends FinesMacBaseComponent<FinesService> implements OnInit, OnDestroy {
  private readonly ngUnsubscribe = new Subject<void>();
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  protected readonly globalStateService = inject(GlobalStateService);
  private readonly opalFinesService = inject(OpalFines);
  protected readonly finesService = inject(FinesService);
  private readonly finesMacPayloadService = inject(FinesMacPayloadService);
  protected readonly utilsService = inject(UtilsService);
  private readonly userState = this.globalStateService.userState();
  protected readonly dateService = inject(DateService);
  private readonly transformationService = inject(TransformationService);

  protected enforcementCourtsData!: IOpalFinesCourt[];
  protected localJusticeAreasData!: IOpalFinesLocalJusticeArea[];

  protected readonly finesRoutes = FINES_ROUTING_PATHS;
  protected readonly finesMacRoutes = FINES_MAC_ROUTING_PATHS;
  protected readonly finesDraftRoutes = FINES_DRAFT_CAM_ROUTING_PATHS;

  private draftAccountFinesMacState!: IDraftAccountResolver | null;
  public isReadOnly!: boolean;
  public status!: string;

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
    const finesMacAddAccountPayload = this.finesMacPayloadService.buildAddAccountPayload(
      this.finesService.finesMacState,
      this.userState,
    );
    this.opalFinesService
      .postDraftAddAccountPayload(finesMacAddAccountPayload)
      .pipe(
        tap(() => {
          this.handleRoute(this.finesMacRoutes.children.submitConfirmation);
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
   * Updates the state of the fines service with the provided draft account payload.
   *
   * This method updates two different states within the fines service:
   * 1. The `finesDraftState` with the provided `draftAccount`.
   * 2. The `finesMacState` with the mapped account payload derived from the `draftAccount`.
   *
   * @param draftAccount - The payload containing the draft account details to update the fines service state.
   * @returns void
   */
  private updateFinesServiceState(draftAccount: IFinesMacAddAccountPayload): void {
    this.updateServiceState(this.finesService, draftAccount, 'finesDraftState');
    this.updateServiceState(
      this.finesService,
      this.finesMacPayloadService.mapAccountPayload(draftAccount),
      'finesMacState',
    );
  }

  /**
   * Retrieves the draft account status and maps it to the corresponding status.
   * The status is obtained from the fines service and mapped using the provided
   * draft state and status mapping.
   *
   * @private
   * @returns {void}
   */
  private getDraftAccountStatus(): void {
    this.status = this.getMappedStatus(this.finesService, 'finesDraftState.account_status', FINES_DRAFT_TAB_STATUSES);
  }

  /**
   * Maps the business unit details from camelCase to snake_case and updates the fines service state.
   *
   * @param businessUnit - The business unit details in camelCase format.
   * @remarks
   * This method transforms the business unit details from camelCase to snake_case
   * due to the `getBusinessUnitById` method returning data in camelCase. This is a temporary
   * solution and should be refactored once the endpoint returns data in the correct format.
   */
  private mapBusinessUnitDetails(businessUnit: IOpalFinesBusinessUnitNonSnakeCase): void {
    // Due to getBusinessUnitById being camelCase, we need to map the snake_case to camelCase
    // Refactor once endpoint fixed
    const businessUnitSnakeCase = this.transformationService.transformCamelToSnakeCase(businessUnit);
    this.updateNestedServiceState(this.finesService, businessUnitSnakeCase, 'finesMacState.businessUnit');
  }

  /**
   * Maps offence details from the provided offences data to the fines service state.
   *
   * This method updates the `fm_offence_details_offence_cjs_code` property of each offence
   * in the `finesMacState.offenceDetails` array by finding the corresponding offence in the
   * provided `offencesData` array based on the `offenceId`.
   *
   * @param offencesData - An array of offence data objects in non-snake case format.
   *
   * @remarks
   * This method is a temporary solution due to the `getOffencesById` method returning data
   * in camelCase. It should be refactored once the endpoint is fixed to return data in the
   * expected format.
   */
  private mapOffenceDetails(offencesData: IOpalFinesOffencesNonSnakeCase[]): void {
    // Due to getOffencesById being camelCase, we need to map the snake_case to camelCase
    // Refactor once endpoint fixed
    const offenceDataSnakeCase = this.transformationService.transformCamelToSnakeCase(offencesData);
    this.mapArrayData(
      this.finesService,
      offenceDataSnakeCase,
      'finesMacState.offenceDetails',
      'formData.fm_offence_details_offence_id',
      'offence_id',
      [{ sourceKey: 'cjs_code', targetKey: 'formData.fm_offence_details_offence_cjs_code' }],
    );
  }

  /**
   * Retrieves the draft account fines MAC state from the activated route snapshot.
   * If the state is available, it updates the fines service state, maps the business unit details,
   * maps the offence details, and sets the component to read-only mode.
   *
   * @private
   * @returns {void}
   */
  private getDraftAccountFinesMacState(): void {
    if (this.activatedRoute.snapshot) {
      this.draftAccountFinesMacState = this.activatedRoute.snapshot.data['draftAccountFinesMacState'];
      if (this.draftAccountFinesMacState) {
        const { draftAccount, businessUnit, offencesData } = this.draftAccountFinesMacState;
        this.updateFinesServiceState(draftAccount);
        if (this.finesService.finesMacState) {
          this.getDraftAccountStatus();
          this.mapBusinessUnitDetails(businessUnit);
          this.mapOffenceDetails(offencesData);
          this.isReadOnly = true;
        }
      }
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

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();

    this.globalStateService.error.set({
      error: false,
      message: '',
    });
  }

  public ngOnInit(): void {
    this.getDraftAccountFinesMacState();
  }
}
