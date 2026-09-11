import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IOpalFinesAccountMajorCreditorDetailsHistoryAndNotesTabRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-major-creditor-details-history-and-notes-tab-ref-data.interface';
import { FinesAccountHistoryTableComponent } from '../../../fines-account-history-table/fines-account-history-table.component';
import { FINES_ACCOUNT_HISTORY_TABLE_MAPPING_DISPLAY } from '../../../fines-account-history-table/constants/fines-account-history-table-mapping-display.constant';
import { FINES_ACCOUNT_HISTORY_TABLE_MAPPING_FIELD_PATHS } from '../../../fines-account-history-table/constants/fines-account-history-table-mapping-field-paths.constant';
import { createFinesAccountHistoryTableAdapter } from '../../../fines-account-history-table/utils/fines-account-history-table-mapping.utils';
import { FINES_ACC_MAJOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_TABLE_HISTORY_ITEM_KEYS } from './constants/fines-acc-major-creditor-details-history-and-notes-table-history-item-keys.constant';

@Component({
  selector: 'app-fines-acc-major-creditor-details-history-and-notes-table',
  imports: [FinesAccountHistoryTableComponent],
  templateUrl: './fines-acc-major-creditor-details-history-and-notes-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccMajorCreditorDetailsHistoryAndNotesTableComponent {
  private readonly router = inject(Router);

  public readonly historyTableAdapter = createFinesAccountHistoryTableAdapter(this.router, {
    display: FINES_ACCOUNT_HISTORY_TABLE_MAPPING_DISPLAY,
    fieldPaths: FINES_ACCOUNT_HISTORY_TABLE_MAPPING_FIELD_PATHS,
    historyItemKeys: FINES_ACC_MAJOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_TABLE_HISTORY_ITEM_KEYS,
  });

  @Input({ required: true }) public tabData!: IOpalFinesAccountMajorCreditorDetailsHistoryAndNotesTabRefData;
}
