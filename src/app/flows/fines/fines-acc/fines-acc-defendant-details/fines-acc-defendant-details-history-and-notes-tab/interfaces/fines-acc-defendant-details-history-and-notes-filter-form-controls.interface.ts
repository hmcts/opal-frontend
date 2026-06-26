import { FormControl, FormRecord } from '@angular/forms';

export interface IFinesAccDefendantDetailsHistoryAndNotesFilterFormControls {
  dateFrom: FormControl<string | null>;
  dateTo: FormControl<string | null>;
  categories: FormRecord<FormControl<boolean>>;
}
