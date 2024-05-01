import { ChangeDetectionStrategy, Component, Input, afterNextRender } from '@angular/core';

@Component({
  selector: 'app-scotgov-date-picker',
  standalone: true,
  imports: [],
  templateUrl: './scotgov-date-picker.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScotgovDatePickerComponent {
  @Input({ required: true }) labelText!: string;
  @Input({ required: false }) hintText: string = '';

  constructor() {
    afterNextRender(() => {
      // Only trigger the render of the component in the browser
      this.configureDatePicker();
    });
  }

  /**
   * Configures the date picker functionality using the scottish government library.
   */
  configureDatePicker(): void {
    import('@scottish-government/design-system/src/all').then((datePicker) => {
      datePicker.initAll();
    });
  }
}
