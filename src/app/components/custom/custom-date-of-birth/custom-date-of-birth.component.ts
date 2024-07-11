import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IFormControlErrorMessage } from '@interfaces';
import { DateTime } from 'luxon';
import { ScotgovDatePickerComponent } from '../../scotgov/scotgov-date-picker/scotgov-date-picker.component';

@Component({
  selector: 'app-custom-date-of-birth',
  standalone: true,
  imports: [ScotgovDatePickerComponent],
  templateUrl: './custom-date-of-birth.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomDateOfBirthComponent {
  @Input({ required: true }) form!: FormGroup;
  @Input({ required: true }) formControlErrorMessages!: IFormControlErrorMessage;
  @Output() dateChange = new EventEmitter<string>();

  public yesterday: string = DateTime.now().minus({ days: 1 }).setLocale('en-gb').toLocaleString();

  public emitDateChange(date: string): void {
    this.dateChange.emit(date);
  }
}
