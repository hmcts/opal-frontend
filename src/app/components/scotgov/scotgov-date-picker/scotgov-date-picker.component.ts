import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, afterNextRender } from '@angular/core';
import { AbstractControl, FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-scotgov-date-picker',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './scotgov-date-picker.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScotgovDatePickerComponent {
  private _control!: FormControl;

  @Input({ required: true }) labelText!: string;
  @Input({ required: false }) labelClasses!: string;
  @Input({ required: false }) hintText!: string;
  @Input({ required: true }) inputId!: string;
  @Input({ required: true }) inputName!: string;
  @Input({ required: false }) inputClasses!: string;
  @Input({ required: false }) minDate!: string;
  @Input({ required: false }) maxDate!: string;
  @Input({ required: false }) disabledDates!: string[];
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
   * Configures the date picker functionality using the scottish government library.
   */
  public configureDatePicker(): void {
    import('@scottish-government/design-system/src/all').then((datePicker) => {
      datePicker.initAll();
    });
  }

  /**
   * Converts the `disabledDates` array into a space-separated string.
   *
   * @returns A space-separated string of dates from the `disabledDates` array.
   * If `disabledDates` is not an array or is undefined, it returns an empty string.
   */
  public getDisabledDates(): string {
    return this.disabledDates ? this.disabledDates.join(' ') : '';
  }

  protected setDateValue(value: string) {
    this.dateChange.emit(value);
  }

  public hasError(): boolean {
    return !!this.errors;
  }
}
