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

    return {
      'Date added': apiImposition.date_added,
      Imposition: apiImposition.imposition.result_id,
      Creditor: this.getCreditorDisplay(apiImposition),
      Imposed: apiImposition.imposed_amount,
      'Paid/Written off': apiImposition.paid_amount,
      Balance: roundedBalance,
      'Date imposed': apiImposition.date_imposed,
      Offence: apiImposition.offence.title,
      'Imposed by': apiImposition.imposed_by?.court_name ?? null,
      'Imposition ID': apiImposition.imposition_id,
      'Creditor account id': apiImposition.creditor.creditor_account_id,
      'Minor creditor party id': apiImposition.creditor.minor_creditor_party_id,
      hasZeroBalance,
      rowClasses: hasZeroBalance ? this.zeroBalanceRowClass : '',
    };
  }

  /**
   * Returns the creditor display text until creditor navigation is wired in.
   *
   * @param apiImposition - The API imposition data to read creditor details from.
   * @returns The creditor name or account ID, when present.
   */
  public getCreditorDisplay(apiImposition: IOpalFinesAccountDefendantDetailsImposition): string | null {
    return (
      apiImposition.creditor.name ??
      apiImposition.creditor.display_name ??
      apiImposition.creditor.creditor_account_id.toString()
    );
  }

  /**
   * Determines whether the creditor should route to the minor creditor details page.
   *
   * @param impositionTableRow - The imposition table row to check.
   * @returns Whether the imposition has a linked minor creditor party.
   */
  public isMinorCreditor(impositionTableRow: IAccountEnquiryImpositionTabTableRow): boolean {
    return impositionTableRow['Minor creditor party id'] !== null;
  }

  /**
   * Builds the route commands for the minor creditor details page.
   *
   * @param impositionTableRow - The imposition table row to build a link for.
   * @returns Router link commands for the minor creditor details route.
   */
  public getMinorCreditorDetailsRouterLink(
    impositionTableRow: IAccountEnquiryImpositionTabTableRow,
  ): (string | number)[] {
    const creditorAccountId = impositionTableRow['Creditor account id'];

    return [
      '/',
      FINES_ROUTING_PATHS.root,
      FINES_ACC_ROUTING_PATHS.root,
      FINES_ACC_MINOR_CREDITOR_ROUTING_PATHS.root,
      creditorAccountId,
      FINES_ACC_MINOR_CREDITOR_ROUTING_PATHS.children.details,
    ];
  }
}
