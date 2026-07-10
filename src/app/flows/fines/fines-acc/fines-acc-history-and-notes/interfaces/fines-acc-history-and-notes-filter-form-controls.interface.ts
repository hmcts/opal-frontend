import { FormControl, FormRecord } from '@angular/forms';

export interface IFinesAccHistoryAndNotesFilterFormControls {
  dateFrom: FormControl<string | null>;
  dateTo: FormControl<string | null>;
  categories: FormRecord<FormControl<boolean>>;
}
