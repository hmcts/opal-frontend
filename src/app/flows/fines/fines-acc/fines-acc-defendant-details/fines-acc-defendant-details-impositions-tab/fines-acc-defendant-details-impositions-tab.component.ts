import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, Input } from '@angular/core';
import { AbstractSortableTableComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table';
import { IAbstractTableData } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/interfaces';
import { SortableValuesType } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/types';
import { CustomHorizontalScrollPaneComponent } from '@hmcts/opal-frontend-common/components/custom/custom-horizontal-scroll-pane';
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
import { FINES_ACC_SUMMARY_TABS_CONTENT_STYLES } from '../../constants/fines-acc-summary-tabs-content-styles.constant';
import { FinesNotProvidedComponent } from '../../../components/fines-not-provided/fines-not-provided.component';
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
}

@Component({
  selector: 'app-fines-acc-defendant-details-impositions-tab',
  imports: [
    CustomHorizontalScrollPaneComponent,
    DateFormatPipe,
    FinesNotProvidedComponent,
    MojSortableTableComponent,
    MojSortableTableHeaderComponent,
    MojSortableTableRowComponent,
    MojSortableTableRowDataComponent,
    MojSortableTableStatusComponent,
    MonetaryPipe,
    NgTemplateOutlet,
  ],
  templateUrl: './fines-acc-defendant-details-impositions-tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccDefendantDetailsImpositionsTabComponent extends AbstractSortableTableComponent {
  protected readonly DATE_INPUT_FORMAT = 'dd/MM/yyyy';
  protected readonly DATE_OUTPUT_FORMAT = 'dd MMM yyyy';
  protected readonly zeroBalanceRowClass = 'govuk-light-grey-background-colour';

  @Input({ required: true }) public set tabData(tabData: IOpalFinesAccountDefendantDetailsImpositionsTabRefData) {
    this.setTableData(tabData.impositions.map((imposition) => this.mapImpositionToTableRow(imposition)));
    this.onApplyFilters();
  }

  @Input() style: IFinesAccSummaryTabsContentStyles = FINES_ACC_SUMMARY_TABS_CONTENT_STYLES;

  public readonly impositionRows = computed(() => this.sortedTableDataSignal() as IImpositionTableRow[]);

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
