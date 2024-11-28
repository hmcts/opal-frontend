import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
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
import { Observable, tap } from 'rxjs';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { CommonModule } from '@angular/common';
import { FinesMacReviewAccountPersonalDetailsComponent } from './fines-mac-review-account-personal-details/fines-mac-review-account-personal-details.component';
import { FinesMacReviewAccountContactDetailsComponent } from './fines-mac-review-account-contact-details/fines-mac-review-account-contact-details.component';
import { FinesMacReviewAccountEmployerDetailsComponent } from './fines-mac-review-account-employer-details/fines-mac-review-account-employer-details.component';

import { FinesMacReviewAccountPaymentTermsComponent } from './fines-mac-review-account-payment-terms/fines-mac-review-account-payment-terms.component';
import { FinesMacReviewAccountAccountCommentsAndNotesComponent } from './fines-mac-review-account-account-comments-and-notes/fines-mac-review-account-account-comments-and-notes.component';
import { FinesMacReviewAccountOffenceDetailsComponent } from './fines-mac-review-account-offence-details/fines-mac-review-account-offence-details.component';
import { FINES_MAC_ACCOUNT_COMMENTS_NOTES_FORM_MOCK } from '../fines-mac-account-comments-notes/mocks/fines-mac-account-comments-notes-form.mock';
import { FINES_MAC_ACCOUNT_DETAILS_STATE_MOCK } from '../fines-mac-account-details/mocks/fines-mac-account-details-state.mock';
import { FINES_MAC_CONTACT_DETAILS_FORM_MOCK } from '../fines-mac-contact-details/mocks/fines-mac-contact-details-form.mock';
import { FINES_MAC_COURT_DETAILS_FORM_MOCK } from '../fines-mac-court-details/mocks/fines-mac-court-details-form.mock';
import { FINES_MAC_EMPLOYER_DETAILS_FORM_MOCK } from '../fines-mac-employer-details/mocks/fines-mac-employer-details-form.mock';
import { FINES_MAC_OFFENCE_DETAILS_FORM_MOCK } from '../fines-mac-offence-details/mocks/fines-mac-offence-details-form.mock';
import { FINES_MAC_PAYMENT_TERMS_FORM_MOCK } from '../fines-mac-payment-terms/mocks/fines-mac-payment-terms-form.mock';
import { FINES_MAC_PERSONAL_DETAILS_FORM_MOCK } from '../fines-mac-personal-details/mocks/fines-mac-personal-details-form.mock';

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
  ],
  templateUrl: './fines-mac-review-account.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacReviewAccountComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  private readonly opalFinesService = inject(OpalFines);
  protected readonly finesService = inject(FinesService);

  protected enforcementCourtsData!: IOpalFinesCourt[];

  protected readonly fineMacRoutes = FINES_MAC_ROUTING_PATHS;

  protected readonly enforcementCourtsData$: Observable<IOpalFinesCourtRefData> = this.opalFinesService
    .getCourts(this.finesService.finesMacState.businessUnit.business_unit_id)
    .pipe(
      tap((response: IOpalFinesCourtRefData) => {
        this.enforcementCourtsData = response.refData;
      }),
    );

  /**
   * Navigates back to the previous page
   * Page navigation set to false to trigger the canDeactivate guard
   */
  public navigateBack(): void {
    this.handleRoute(this.fineMacRoutes.children.accountDetails);
  }

  /**
   * Navigates to the specified route.
   *
   * @param route - The route to navigate to.
   */
  public handleRoute(route: string, nonRelative: boolean = false, event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    if (nonRelative) {
      this.router.navigate([route]);
    } else {
      this.router.navigate([route], { relativeTo: this.activatedRoute.parent });
    }
  }

  public ngOnInit(): void {
    this.finesService.finesMacState = {
      ...this.finesService.finesMacState,
      accountDetails: {
        ...this.finesService.finesMacState.accountDetails,
        formData: { ...FINES_MAC_ACCOUNT_DETAILS_STATE_MOCK },
      },
      accountCommentsNotes: {
        ...FINES_MAC_ACCOUNT_COMMENTS_NOTES_FORM_MOCK,
      },
      courtDetails: { ...FINES_MAC_COURT_DETAILS_FORM_MOCK },
      personalDetails: { ...FINES_MAC_PERSONAL_DETAILS_FORM_MOCK },
      contactDetails: { ...FINES_MAC_CONTACT_DETAILS_FORM_MOCK },
      employerDetails: { ...FINES_MAC_EMPLOYER_DETAILS_FORM_MOCK },
      offenceDetails: [
        {
          ...FINES_MAC_OFFENCE_DETAILS_FORM_MOCK,
          formData: {
            ...FINES_MAC_OFFENCE_DETAILS_FORM_MOCK.formData,
            fm_offence_details_offence_id: 'TP11003',
          },
        },
      ],
      paymentTerms: {
        ...FINES_MAC_PAYMENT_TERMS_FORM_MOCK,
        formData: {
          ...FINES_MAC_PAYMENT_TERMS_FORM_MOCK.formData,
          fm_payment_terms_has_days_in_default: true,
          fm_payment_terms_suspended_committal_date: '25/12/2024',
          fm_payment_terms_default_days_in_jail: 30,
          fm_payment_terms_add_enforcement_action: false,
          //fm_payment_terms_hold_enforcement_on_account: true,
          //fm_payment_terms_enforcement_action: 'PRIS',
          //fm_payment_terms_reason_account_is_on_noenf: 'Test comment',
          //fm_payment_terms_earliest_release_date: '25/12/2024',
          fm_payment_terms_payment_terms: 'lumpSumPlusInstalments',
          fm_payment_terms_lump_sum_amount: 1000,
          fm_payment_terms_instalment_amount: 500,
          fm_payment_terms_instalment_period: 'M',
          fm_payment_terms_start_date: '25/12/2024',
          fm_payment_terms_payment_card_request: false,
          fm_payment_terms_collection_order_made: false,
          fm_payment_terms_collection_order_date: '25/12/2024',
          fm_payment_terms_collection_order_made_today: false,
        },
      },
    };
  }
}
