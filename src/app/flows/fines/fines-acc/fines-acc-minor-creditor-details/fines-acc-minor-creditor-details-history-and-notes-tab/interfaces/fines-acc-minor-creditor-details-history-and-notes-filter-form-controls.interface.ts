import { FormControl, FormRecord } from '@angular/forms';

export interface IFinesAccMinorCreditorDetailsHistoryAndNotesFilterFormControls {
  dateFrom: FormControl<string | null>;
  dateTo: FormControl<string | null>;
  categories: FormRecord<FormControl<boolean>>;
}
