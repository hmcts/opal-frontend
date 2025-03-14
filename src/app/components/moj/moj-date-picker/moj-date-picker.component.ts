import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  afterNextRender,
  inject,
} from '@angular/core';
import { FormControl, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { DateService } from 'opal-frontend-common';

@Component({
  selector: 'app-moj-date-picker',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './moj-date-picker.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MojDatePickerComponent implements OnInit {
  private _control!: FormControl;
  public disabledDatesConcatenated!: string;

  private readonly dateService = inject(DateService);

  @Input({ required: true }) labelText!: string;
  @Input({ required: false }) labelClasses!: string;
  @Input({ required: false }) hintText!: string;
  @Input({ required: true }) inputId!: string;
  @Input({ required: true }) inputName!: string;
  @Input({ required: false }) inputClasses!: string;
  @Input({ required: false }) minDate!: string;
  @Input({ required: false }) maxDate!: string;
  @Input({ required: false }) disabledDates!: string[];
  @Input({ required: false }) disabledDays!: string;
  @Input({ required: false }) errors: string | null = null;
  @Output() dateChange = new EventEmitter<string>();

  @Input({ required: true }) set control(abstractControl: AbstractControl) {
    // Form controls are passed in as abstract controls, we need to re-cast it.
    this._control = abstractControl as FormControl;
  }

  get getControl() {
    return this._control;
  }

  constructor() {
    afterNextRender(() => {
      // Only trigger the render of the component in the browser
      this.configureDatePicker();
    });
  }

  /**
   * Retrieves the disabled dates and concatenates them into a single string.
   */
  private concatenateDisabledDates(): void {
    this.disabledDatesConcatenated = this.disabledDates ? this.disabledDates.join(' ') : '';
  }

  /**
   * Sets the date value and emits the updated value through the `dateChange` event.
   *
   * @param value - The new date value to set.
   */
  protected setDateValue(value: string) {
    const parsedDate = this.dateService.getFromFormat(value, 'd/M/yyyy');
    if (parsedDate.isValid) {
      const formattedDate = parsedDate.toFormat('dd/MM/yyyy'); // Formats with leading zeros
      this.dateChange.emit(formattedDate);
    } else {
      this.dateChange.emit(value);
    }
  }

  /**
   * Configures the date picker functionality using the moj library.
   */
  public configureDatePicker(): void {
    import('@ministryofjustice/frontend/moj/all').then((datePicker) => {
      datePicker.initAll();
    });
  }

  public ngOnInit(): void {
    this.concatenateDisabledDates();
  }
}
