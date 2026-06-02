import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, Input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AbstractSortableTablePaginationComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table-pagination';
import { CustomHorizontalScrollPaneComponent } from '@hmcts/opal-frontend-common/components/custom/custom-horizontal-scroll-pane';
import { MojPaginationComponent } from '@hmcts/opal-frontend-common/components/moj/moj-pagination';
import {
  MojSortableTableComponent,
  MojSortableTableHeaderComponent,
  MojSortableTableRowComponent,
  MojSortableTableRowDataComponent,
  MojSortableTableStatusComponent,
} from '@hmcts/opal-frontend-common/components/moj/moj-sortable-table';
import { DateFormatPipe } from '@hmcts/opal-frontend-common/pipes/date-format';
import { MonetaryPipe } from '@hmcts/opal-frontend-common/pipes/monetary';
import { IOpalFinesAccountDefendantDetailsImposition } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-details-imposition.interface';
import { IOpalFinesAccountDefendantDetailsImpositionsTabRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-details-impositions-tab-ref-data.interface';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { FINES_ACC_SUMMARY_TABS_CONTENT_STYLES } from '../../constants/fines-acc-summary-tabs-content-styles.constant';
import { FinesNotProvidedComponent } from '../../../components/fines-not-provided/fines-not-provided.component';
import { FINES_ACC_ROUTING_PATHS } from '../../routing/constants/fines-acc-routing-paths.constant';
import { FINES_ACC_MINOR_CREDITOR_ROUTING_PATHS } from '../../routing/constants/fines-acc-minor-creditor-routing-paths.constant';
import { FINES_ACC_MAJOR_CREDITOR_ROUTING_PATHS } from '../../routing/constants/fines-acc-major-creditor-routing-paths.constant';
import { IFinesAccSummaryTabsContentStyles } from '../interfaces/fines-acc-summary-tabs-content-styles.interface';
import { IAccountEnquiryImpositionTabTableRow } from '../interfaces/account-enquiry-imposition-tab-table-row.interface';

@Component({
  selector: 'app-fines-acc-defendant-details-impositions-tab',
  imports: [
    CustomHorizontalScrollPaneComponent,
    DateFormatPipe,
    FinesNotProvidedComponent,
    MojPaginationComponent,
    MojSortableTableComponent,
    MojSortableTableHeaderComponent,
    MojSortableTableRowComponent,
    MojSortableTableRowDataComponent,
    MojSortableTableStatusComponent,
    MonetaryPipe,
    NgTemplateOutlet,
    RouterLink,
  ],
  templateUrl: './fines-acc-defendant-details-impositions-tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccDefendantDetailsImpositionsTabComponent extends AbstractSortableTablePaginationComponent {
  protected readonly DATE_INPUT_FORMAT = 'yyyy-MM-dd';
  protected readonly DATE_OUTPUT_FORMAT = 'dd MMM yyyy';
  protected readonly zeroBalanceRowClass = 'govuk-light-grey-background-colour';

  @Input({ required: true }) public set tabData(tabData: IOpalFinesAccountDefendantDetailsImpositionsTabRefData) {
    this.setTableData(tabData.impositions.map((imposition) => this.mapImpositionToTableRow(imposition)));
    this.onApplyFilters();
  }

  @Input() style: IFinesAccSummaryTabsContentStyles = FINES_ACC_SUMMARY_TABS_CONTENT_STYLES;

  public override paginatedTableDataComputed = computed(() => {
    const data = this.sortedTableDataSignal() as IAccountEnquiryImpositionTabTableRow[];
    return data.slice(this.startIndexComputed() - 1, this.endIndexComputed());
  });
  public override itemsPerPageSignal = signal(25);

  /**
   * Gets the static route prefix for minor creditor details links.
   */
  private get minorCreditorDetailsRouterLinkPrefix(): string {
    return `/${FINES_ROUTING_PATHS.root}/${FINES_ACC_ROUTING_PATHS.root}/${FINES_ACC_MINOR_CREDITOR_ROUTING_PATHS.root}`;
  }

  /**
   * Gets the minor creditor details route segment.
   */
  private get minorCreditorDetailsRouterLinkSuffix(): string {
    return FINES_ACC_MINOR_CREDITOR_ROUTING_PATHS.children.details;
  }

  /**
   * Gets the static route prefix for major creditor details links.
   */
  private get majorCreditorDetailsRouterLinkPrefix(): string {
    return `/${FINES_ROUTING_PATHS.root}/${FINES_ACC_ROUTING_PATHS.root}/${FINES_ACC_MAJOR_CREDITOR_ROUTING_PATHS.root}`;
  }

  /**
   * Gets the major creditor details route segment.
   */
  private get majorCreditorDetailsRouterLinkSuffix(): string {
    return FINES_ACC_MAJOR_CREDITOR_ROUTING_PATHS.children.details;
  }

  /**
   * Maps an imposition from the API response into the table row shape used by the sortable table.
   *
   * @param apiImposition - The API imposition data to display in the table.
   * @returns The imposition formatted as an account enquiry imposition table row.
   */
  private mapImpositionToTableRow(
    apiImposition: IOpalFinesAccountDefendantDetailsImposition,
  ): IAccountEnquiryImpositionTabTableRow {
    const roundedBalance = Number(apiImposition.balance.toFixed(2));
    const hasZeroBalance = roundedBalance === 0;
    const isMinorCreditor = apiImposition.creditor.minor_creditor_party_id !== null;
    const isMajorCreditor = apiImposition.creditor.major_creditor_id !== null;
    const creditorAccountId = apiImposition.creditor.creditor_account_id;
    const creditorDisplay =
      apiImposition.creditor.name ?? apiImposition.creditor.display_name ?? creditorAccountId.toString();
    let creditorDetailsRouterLink: string | null = null;

    if (isMinorCreditor) {
      creditorDetailsRouterLink = `${this.minorCreditorDetailsRouterLinkPrefix}/${creditorAccountId}/${this.minorCreditorDetailsRouterLinkSuffix}`;
    } else if (isMajorCreditor) {
      creditorDetailsRouterLink = `${this.majorCreditorDetailsRouterLinkPrefix}/${creditorAccountId}/${this.majorCreditorDetailsRouterLinkSuffix}`;
    }

    return {
      'Date added': apiImposition.date_added,
      Imposition: apiImposition.imposition.result_id,
      Creditor: creditorDisplay,
      Imposed: apiImposition.imposed_amount,
      'Paid/Written off': apiImposition.paid_amount,
      Balance: roundedBalance,
      'Date imposed': apiImposition.date_imposed,
      Offence: apiImposition.offence.title,
      'Imposed by': apiImposition.imposed_by?.court_name ?? null,
      'Imposition ID': apiImposition.imposition_id,
      'Creditor account id': creditorAccountId,
      'Minor creditor party id': apiImposition.creditor.minor_creditor_party_id,
      'Major creditor id': apiImposition.creditor.major_creditor_id,
      creditorDetailsRouterLink,
      hasZeroBalance,
      rowClasses: hasZeroBalance ? this.zeroBalanceRowClass : '',
    };
  }
}
