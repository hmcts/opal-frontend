import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IAbstractFormControlErrorMessage } from '@interfaces/components/abstract';
import { DateTime } from 'luxon';
import { ScotgovDatePickerComponent } from '@components/scotgov';

@Component({
  selector: 'app-fines-mac-date-of-birth',
  standalone: true,
  imports: [ScotgovDatePickerComponent],
  templateUrl: './fines-mac-date-of-birth.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacDateOfBirthComponent {
  @Input({ required: true }) form!: FormGroup;
  @Input({ required: true }) formControlErrorMessages!: IAbstractFormControlErrorMessage;
  @Output() dateChange = new EventEmitter<string>();

  public yesterday: string = DateTime.now().minus({ days: 1 }).setLocale('en-gb').toLocaleString();

  public emitDateChange(date: string): void {
    this.dateChange.emit(date);
  }
}
