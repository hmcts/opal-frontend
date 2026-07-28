import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IOpalFinesAccountMinorCreditorDetailsHistoryAndNotesTabRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-minor-creditor-details-history-and-notes-tab-ref-data.interface';
import { FinesAccountHistoryTableComponent } from '../../../fines-account-history-table/fines-account-history-table.component';
import { createFinesAccountHistoryTableAdapter } from '../../../fines-account-history-table/utils/fines-account-history-table-mapping.utils';
import { FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_TAB_HISTORY_ITEM_KEYS } from '../constants/fines-acc-minor-creditor-details-history-and-notes-tab-history-item-keys.constant';
import { FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_TABLE_DISPLAY } from './constants/fines-acc-minor-creditor-details-history-and-notes-table-display.constant';
import { FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_TABLE_FIELD_PATHS } from './constants/fines-acc-minor-creditor-details-history-and-notes-table-field-paths.constant';

@Component({
  selector: 'app-fines-acc-minor-creditor-details-history-and-notes-table',
  imports: [FinesAccountHistoryTableComponent],
  templateUrl: './fines-acc-minor-creditor-details-history-and-notes-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccMinorCreditorDetailsHistoryAndNotesTableComponent {
  private readonly router = inject(Router);

  public readonly historyTableAdapter = createFinesAccountHistoryTableAdapter(this.router, {
    display: FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_TABLE_DISPLAY,
    fieldPaths: FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_TABLE_FIELD_PATHS,
    historyItemKeys: FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_TAB_HISTORY_ITEM_KEYS,
  });

  @Input({ required: true }) public tabData!: IOpalFinesAccountMinorCreditorDetailsHistoryAndNotesTabRefData;
}
