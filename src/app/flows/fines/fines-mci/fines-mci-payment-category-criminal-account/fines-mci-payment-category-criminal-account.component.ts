import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GovukBackLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-back-link';
import { GovukCancelLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-cancel-link';
import {
  GovukSummaryListComponent,
  GovukSummaryListRowComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-summary-list';
import {
  MojAlertComponent,
  MojAlertContentComponent,
  MojAlertIconComponent,
  MojAlertTextComponent,
} from '@hmcts/opal-frontend-common/components/moj/moj-alert';
import { DateFormatPipe } from '@hmcts/opal-frontend-common/pipes/date-format';
import { MonetaryPipe } from '@hmcts/opal-frontend-common/pipes/monetary';
import { FINES_ROUTING_PATHS } from '../../routing/constants/fines-routing-paths.constant';
import { FINES_ACC_ROUTING_PATHS } from '../../fines-acc/routing/constants/fines-acc-routing-paths.constant';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../../fines-acc/routing/constants/fines-acc-defendant-routing-paths.constant';
import { FINES_MCI_ROUTING_PATHS } from '../routing/constants/fines-mci-routing-paths.constant';
import { OPAL_FINES_CONFIGURATION_ITEMS } from '@services/fines/opal-fines-service/constants/opal-fines-configuration-items.constant';
import { FinesMciStore } from '../stores/fines-mci.store';
import {
  FINES_MCI_PAYMENT_CATEGORY_CRIMINAL_ACCOUNT_CONTENT,
  FINES_MCI_PAYMENT_CATEGORY_CRIMINAL_ACCOUNT_RESTRICTED_STATUS_WARNINGS,
} from './constants/fines-mci-payment-category-criminal-account-content.constant';

@Component({
  selector: 'app-fines-mci-payment-category-criminal-account',
  imports: [
    RouterLink,
    MojAlertComponent,
    MojAlertContentComponent,
    MojAlertIconComponent,
    MojAlertTextComponent,
    GovukBackLinkComponent,
    GovukCancelLinkComponent,
    GovukSummaryListComponent,
    GovukSummaryListRowComponent,
  ],
  providers: [DateFormatPipe, MonetaryPipe],
  templateUrl: './fines-mci-payment-category-criminal-account.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMciPaymentCategoryCriminalAccountComponent {
  private readonly store = inject(FinesMciStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dateFormat = inject(DateFormatPipe);
  private readonly monetary = inject(MonetaryPipe);

  private readonly lastEnforcementAction = computed(() => {
    const action = this.store.selectedCriminalAccountAtAGlance()?.enforcement_status?.last_enforcement_action;
    return action
      ? [
          action.last_enforcement_action_title,
          action.last_enforcement_action_id ? `(${action.last_enforcement_action_id})` : null,
        ]
          .filter(Boolean)
          .join(' ')
      : null;
  });

  protected readonly businessUnitName = computed(() => this.store.businessUnit()?.business_unit_name ?? '—');
  protected readonly accountDetailsRoute = computed(() => [
    '/',
    FINES_ROUTING_PATHS.root,
    FINES_ACC_ROUTING_PATHS.root,
    FINES_ACC_ROUTING_PATHS.children.defendant,
    this.store.selectedCriminalAccount()?.defendant_account_id,
    FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details,
  ]);

  /** Builds display rows from the fresh account details, preserving alias order in the stored response. */
  protected readonly rows = computed(() => {
    const account = this.store.selectedCriminalAccountAtAGlance();
    const party = account?.party_details;
    const individual = party?.individual_details;
    const organisation = party?.organisation_details;
    const isCompany = party?.organisation_flag;
    const aliases = isCompany ? organisation?.organisation_aliases : individual?.individual_aliases;
    const aliasNames = [...(aliases ?? [])]
      .sort((a, b) => a.sequence_number - b.sequence_number)
      .map((alias) =>
        'organisation_name' in alias
          ? alias.organisation_name
          : this.joinName([alias.forenames, alias.surname?.toUpperCase()]),
      );
    const terms = account?.payment_terms;
    const instalmentBased = terms?.payment_terms_type?.payment_terms_type_code === 'I';
    const address = account?.address;
    const notes = account?.comments_and_notes;
    const balance =
      account?.account_balance ?? this.store.selectedCriminalAccountHeader()?.payment_state_summary.account_balance;
    const rows = [
      { label: 'Account number', values: [account?.account_number] },
      {
        label: 'Name',
        values: [
          isCompany
            ? organisation?.organisation_name
            : this.joinName([individual?.title, individual?.forenames, individual?.surname?.toUpperCase()]),
        ],
      },
      { label: 'Aliases', values: aliasNames },
      ...(!isCompany ? [{ label: 'Date of birth', values: [this.formatDate(individual?.date_of_birth)] }] : []),
      {
        label: 'Address',
        values: [
          address?.address_line_1,
          address?.address_line_2,
          address?.address_line_3,
          address?.address_line_4,
          address?.address_line_5,
          address?.postcode,
        ],
      },
      {
        label: 'Balance',
        values: [typeof balance === 'number' && Number.isFinite(balance) ? this.monetary.transform(balance) : null],
      },
      { label: 'Enforcement action', values: [this.lastEnforcementAction()] },
      {
        label: 'Payment terms',
        values: [
          instalmentBased && terms?.lump_sum_amount
            ? 'Lump sum plus instalments'
            : terms?.payment_terms_type?.payment_terms_type_display_name,
        ],
      },
      ...(instalmentBased
        ? [
            { label: 'Frequency', values: [terms?.instalment_period?.instalment_period_display_name] },
            { label: 'Instalments', values: [this.monetary.transform(terms?.instalment_amount)] },
          ]
        : []),
      { label: instalmentBased ? 'Start date' : 'Pay by date', values: [this.formatDate(terms?.effective_date)] },
      {
        label: 'Comments',
        values: [notes?.account_comment, notes?.free_text_note_1, notes?.free_text_note_2, notes?.free_text_note_3],
      },
    ];
    return rows.map((row) => ({
      ...row,
      id: row.label.toLowerCase().replaceAll(' ', '-'),
      values: row.values.filter((value) => !!value?.trim()),
    }));
  });

  protected readonly content = FINES_MCI_PAYMENT_CATEGORY_CRIMINAL_ACCOUNT_CONTENT;
  /**
   * Uses at-a-glance restriction data, falling back to the header for optional status and balance fields.
   * Restricted statuses take precedence over zero balance and business-unit enforcement inhibits.
   */
  protected readonly accountState = computed<{ available: boolean; warningMessage: string | null }>(() => {
    const account = this.store.selectedCriminalAccount();
    const atAGlance = this.store.selectedCriminalAccountAtAGlance();
    const header = this.store.selectedCriminalAccountHeader();
    const businessUnit = this.store.businessUnit();
    const statusCode = atAGlance?.account_status_code ?? header?.account_status_reference.account_status_code;
    const accountId = this.route.snapshot.paramMap.get('accountId');

    if (!account || String(account.defendant_account_id) !== accountId || !atAGlance || !businessUnit || !statusCode) {
      return { available: false, warningMessage: null };
    }

    const statusWarning = FINES_MCI_PAYMENT_CATEGORY_CRIMINAL_ACCOUNT_RESTRICTED_STATUS_WARNINGS[statusCode];
    if (statusWarning) {
      return { available: true, warningMessage: statusWarning };
    }

    const balance = atAGlance.account_balance ?? header?.payment_state_summary.account_balance;
    if (typeof balance !== 'number' || !Number.isFinite(balance)) {
      return { available: false, warningMessage: null };
    }
    if (balance === 0) {
      return { available: true, warningMessage: this.content.zeroBalance };
    }

    const lastEnforcementActionId = atAGlance.enforcement_status?.last_enforcement_action?.last_enforcement_action_id;
    const inhibitedEnforcementActionIds =
      businessUnit.configuration_items.find(
        (item) => item.item_name === OPAL_FINES_CONFIGURATION_ITEMS.resultsToInhibitPayments,
      )?.item_values ?? [];
    if (lastEnforcementActionId && inhibitedEnforcementActionIds.includes(lastEnforcementActionId)) {
      return {
        available: true,
        warningMessage: `${this.content.inhibitedEnforcementAction} ${this.lastEnforcementAction() ?? '—'}`,
      };
    }

    return { available: true, warningMessage: null };
  });
  protected readonly heading = computed(() => {
    const state = this.accountState();
    if (!state.available) return this.content.unavailable;
    return state.warningMessage ? this.content.cannotPay : this.content.success;
  });

  /** Joins available name parts without displaying spaces for missing data. */
  private joinName(parts: (string | null | undefined)[]): string {
    return parts.filter((part) => !!part?.trim()).join(' ');
  }

  /** Supports the ISO API date format and the day-first format used by existing account details. */
  private formatDate(value: string | null | undefined): string {
    return value
      ? this.dateFormat.transform(value, value.includes('/') ? 'dd/MM/yyyy' : 'yyyy-MM-dd', 'dd MMMM yyyy')
      : '—';
  }

  /** Returns to the submitted search results, retaining the search criteria. */
  protected navigateBack(): void {
    void this.router.navigate([FINES_MCI_ROUTING_PATHS.children.matches], { relativeTo: this.route.parent });
  }

  /** Continues only while the selected account remains eligible for payment. */
  protected confirm(): void {
    if (this.heading() !== this.content.success) return;
    void this.router.navigate(
      [FINES_MCI_ROUTING_PATHS.children.paymentDetails, this.route.snapshot.paramMap.get('accountId')],
      { relativeTo: this.route.parent },
    );
  }

  /** Opens the existing suspense journey, retaining the account details for the suspense payment. */
  protected payIntoSuspense(): void {
    const state = this.accountState();
    if (!state.available || !state.warningMessage) return;
    void this.router
      .navigate([
        '/',
        FINES_ROUTING_PATHS.root,
        FINES_MCI_ROUTING_PATHS.root,
        FINES_MCI_ROUTING_PATHS.children.create,
        FINES_MCI_ROUTING_PATHS.children.till,
        FINES_MCI_ROUTING_PATHS.children.payment,
        FINES_MCI_ROUTING_PATHS.children.category,
        FINES_MCI_ROUTING_PATHS.children.suspense,
        FINES_MCI_ROUTING_PATHS.children.paymentDetails,
      ])
      .then((navigated) => {
        if (navigated) this.store.setDraftJourney('suspense');
      });
  }

  /** Clears the payment draft and search only after returning to Till Details successfully. */
  protected handleCancel(): void {
    void this.router
      .navigate([
        '/',
        FINES_ROUTING_PATHS.root,
        FINES_MCI_ROUTING_PATHS.root,
        FINES_MCI_ROUTING_PATHS.children.create,
        FINES_MCI_ROUTING_PATHS.children.till,
        FINES_MCI_ROUTING_PATHS.children.details,
      ])
      .then((navigated) => {
        if (navigated) {
          this.store.setDraftJourney(null);
          this.store.resetCriminalSearch();
        }
      });
  }
}
