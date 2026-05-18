import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, Input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AbstractSortableTablePaginationComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table-pagination';
import { IAbstractTableData } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/interfaces';
import { SortableValuesType } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/types';
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
import {
  IOpalFinesAccountDefendantDetailsImposition,
  IOpalFinesAccountDefendantDetailsImpositionsTabRefData,
} from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-details-impositions-tab-ref-data.interface';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { FINES_ACC_SUMMARY_TABS_CONTENT_STYLES } from '../../constants/fines-acc-summary-tabs-content-styles.constant';
import { FinesNotProvidedComponent } from '../../../components/fines-not-provided/fines-not-provided.component';
import { FINES_ACC_ROUTING_PATHS } from '../../routing/constants/fines-acc-routing-paths.constant';
import { FINES_ACC_MINOR_CREDITOR_ROUTING_PATHS } from '../../routing/constants/fines-acc-minor-creditor-routing-paths.constant';
import { IFinesAccSummaryTabsContentStyles } from '../interfaces/fines-acc-summary-tabs-content-styles.interface';

interface IImpositionTableRow extends IAbstractTableData<SortableValuesType> {
  'Date added': string | null;
  Imposition: string | null;
  Creditor: string | null;
  Imposed: number;
  'Paid/Written off': number;
  Balance: number;
  'Date imposed': string | null;
  Offence: string | null;
  'Imposed by': string | null;
  'Imposition ID': string;
  'Creditor account id': number | null;
  'Creditor account type': string | null;
}

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
  protected readonly DATE_INPUT_FORMAT = 'dd/MM/yyyy';
  protected readonly DATE_OUTPUT_FORMAT = 'dd MMM yyyy';
  protected readonly zeroBalanceRowClass = 'govuk-light-grey-background-colour';

  @Input({ required: true }) public set tabData(tabData: IOpalFinesAccountDefendantDetailsImpositionsTabRefData) {
    this.setTableData(tabData.impositions.map((imposition) => this.mapImpositionToTableRow(imposition)));
    this.onApplyFilters();
  }

  @Input() style: IFinesAccSummaryTabsContentStyles = FINES_ACC_SUMMARY_TABS_CONTENT_STYLES;

  public override paginatedTableDataComputed = computed(() => {
    const data = this.sortedTableDataSignal() as IImpositionTableRow[];
    return data.slice(this.startIndexComputed() - 1, this.endIndexComputed());
  });
  public override itemsPerPageSignal = signal(25);

  private mapImpositionToTableRow(imposition: IOpalFinesAccountDefendantDetailsImposition): IImpositionTableRow {
    return {
      'Date added': imposition.posted_date,
      Imposition: imposition.result_id,
      Creditor: this.getCreditorDisplay(imposition),
      Imposed: imposition.imposed_amount,
      'Paid/Written off': imposition.paid_amount,
      Balance: this.getBalance(imposition),
      'Date imposed': imposition.imposed_date,
      Offence: imposition.offence_title,
      'Imposed by': this.getImposedByDisplay(imposition),
      'Imposition ID': imposition.imposition_id,
      'Creditor account id': imposition.creditor_account_id,
      'Creditor account type': imposition.creditor_account_type,
    };
  }

  /**
   * Calculates the current balance for an imposition.
   *
   * @param imposition - The imposition row to calculate the balance for.
   * @returns The balance rounded to two decimal places.
   */
  public getBalance(imposition: IOpalFinesAccountDefendantDetailsImposition): number {
    return Number((imposition.imposed_amount - imposition.paid_amount).toFixed(2));
  }

  /**
   * Determines whether an imposition has a zero balance.
   *
   * @param imposition - The imposition row to check.
   * @returns Whether the row balance is zero.
   */
  public hasZeroBalance(imposition: IImpositionTableRow): boolean {
    return imposition.Balance === 0;
  }

  /**
   * Returns the CSS classes for an imposition table row.
   *
   * @param imposition - The imposition row to style.
   * @returns The row class string.
   */
  public getRowClasses(imposition: IImpositionTableRow): string {
    return this.hasZeroBalance(imposition) ? this.zeroBalanceRowClass : '';
  }

  /**
   * Returns the creditor display text until creditor navigation is wired in.
   *
   * @param imposition - The imposition row to read creditor details from.
   * @returns The creditor name or account ID, when present.
   */
  public getCreditorDisplay(imposition: IOpalFinesAccountDefendantDetailsImposition): string | null {
    return imposition.creditor_name ?? imposition.creditor_account_id?.toString() ?? null;
  }

  /**
   * Determines whether the creditor should route to the minor creditor details page.
   *
   * @param imposition - The imposition row to check.
   * @returns Whether the imposition has a linked minor creditor account.
   */
  public isMinorCreditor(imposition: IImpositionTableRow): boolean {
    const creditorAccountType = imposition['Creditor account type']?.toLowerCase();

    if (imposition['Creditor account id'] === null) {
      return false;
    }

    return creditorAccountType === 'minor';
  }

  /**
   * Builds the route commands for the minor creditor details page.
   *
   * @param imposition - The imposition row to build a link for.
   * @returns Router link commands for the minor creditor details route.
   */
  public getMinorCreditorDetailsRouterLink(imposition: IImpositionTableRow): (string | number)[] {
    const creditorAccountId = imposition['Creditor account id'];

    if (creditorAccountId === null) {
      return [];
    }

    return [
      '/',
      FINES_ROUTING_PATHS.root,
      FINES_ACC_ROUTING_PATHS.root,
      FINES_ACC_MINOR_CREDITOR_ROUTING_PATHS.root,
      creditorAccountId,
      FINES_ACC_MINOR_CREDITOR_ROUTING_PATHS.children.details,
    ];
  }

  /**
   * Returns the court name only when the imposition has an imposing court ID.
   *
   * @param imposition - The imposition row to read court details from.
   * @returns The imposing court name, when present.
   */
  public getImposedByDisplay(imposition: IOpalFinesAccountDefendantDetailsImposition): string | null {
    if (imposition.imposing_court_id === null) {
      return null;
    }

    return imposition.imposing_court_name;
  }
}
