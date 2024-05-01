import { ChangeDetectionStrategy, Component, afterNextRender } from '@angular/core';

@Component({
  selector: 'app-scotgov-date-picker',
  standalone: true,
  imports: [],
  templateUrl: './scotgov-date-picker.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScotgovDatePickerComponent {

  constructor() {
    afterNextRender(() => {
      // Only trigger the render of the component in the browser
      this.configureDatePicker();
    })
  }

  /**
   * Configures the date picker functionality using the scottish government library.
   */
  private configureDatePicker(): void {
    import('@scottish-government/design-system/src/all').then((datePicker) => {
      datePicker.initAll();
    });
  }
}
