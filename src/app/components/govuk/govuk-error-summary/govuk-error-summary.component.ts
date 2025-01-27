import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IAbstractFormBaseFormErrorSummaryMessage } from '@components/abstract/abstract-form-base/interfaces/abstract-form-base-form-error-summary-message.interface';

@Component({
  selector: 'app-govuk-error-summary',

  imports: [],
  templateUrl: './govuk-error-summary.component.html',
})
export class GovukErrorSummaryComponent {
  @Input() errors: IAbstractFormBaseFormErrorSummaryMessage[] = [];
  @Output() errorClick = new EventEmitter<string>();

  /**
   * Handles the event when clicking an error in the summary
   *
   * @param event - The event object
   * @param fieldId - The ID of the error field
   */
  public handleErrorClick(event: Event, fieldId: string): void {
    event.preventDefault();

    this.errorClick.emit(fieldId);
  }
}
