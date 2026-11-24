import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import {
  MojAlertComponent,
  MojAlertContentComponent,
  MojAlertIconComponent,
  MojAlertTextComponent,
} from '@hmcts/opal-frontend-common/components/moj/moj-alert';
import { IFinesAecAccountTypeRow } from '../../interfaces/fines-aec-account-type-row.interface';
import { FinesAecAccountTypesTableComponent } from './fines-aec-account-types-table/fines-aec-account-types-table.component';

@Component({
  selector: 'app-fines-aec-account-types-tab',
  imports: [
    MojAlertComponent,
    MojAlertContentComponent,
    MojAlertIconComponent,
    MojAlertTextComponent,
    FinesAecAccountTypesTableComponent,
  ],
  templateUrl: './fines-aec-account-types-tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAecAccountTypesTabComponent {
  @Input({ required: true }) public accountTypes!: IFinesAecAccountTypeRow[];
  @Input() public successMessage: string | null = null;
  @Output() public readonly clearSuccessMessage = new EventEmitter<void>();
}
