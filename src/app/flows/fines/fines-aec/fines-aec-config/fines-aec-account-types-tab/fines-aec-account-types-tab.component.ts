import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IFinesAecAccountTypeRow } from '../../interfaces/fines-aec-account-type-row.interface';
import { FinesAecAccountTypesTableComponent } from './fines-aec-account-types-table/fines-aec-account-types-table.component';

@Component({
  selector: 'app-fines-aec-account-types-tab',
  imports: [FinesAecAccountTypesTableComponent],
  templateUrl: './fines-aec-account-types-tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAecAccountTypesTabComponent {
  @Input({ required: true }) public accountTypes!: IFinesAecAccountTypeRow[];
}
