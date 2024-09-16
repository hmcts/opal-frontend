import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IAbstractFormControlErrorMessage } from '@components/abstract/interfaces/abstract-form-control-error-message.interface';
import { ScotgovDatePickerComponent } from '@components/scotgov';
import { DateService } from '@services/date-service/date.service';

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
  @Input({ required: true }) componentName!: string;

  private readonly dateService = inject(DateService);

  public yesterday: string = this.dateService.getPreviousDate({ days: 1 });

  public emitDateChange(date: string): void {
    this.dateChange.emit(date);
  }
}
