import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FinesMacOffenceDetailsReviewOffenceHeadingTitleComponent } from './fines-mac-offence-details-review-offence-heading-title/fines-mac-offence-details-review-offence-heading-title.component';

@Component({
  selector: 'app-fines-mac-offence-details-review-offence-heading',
  imports: [CommonModule, FinesMacOffenceDetailsReviewOffenceHeadingTitleComponent],
  templateUrl: './fines-mac-offence-details-review-offence-heading.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacOffenceDetailsReviewOffenceHeadingComponent {
  @Input({ required: true }) public offenceId!: number;
  @Input({ required: true }) public offenceCode!: string;
  @Input({ required: true }) public offenceTitle!: string;
  @Input({ required: false }) public showActions!: boolean;
  @Input({ required: false }) public isReadOnly: boolean = false;
  @Output() public actionClicked = new EventEmitter<{ actionName: string; offenceId: number }>();

  /**
   * Handles the click event for an action.
   * @param action - The name of the action.
   * @returns void
   */
  public onActionClick(action: string): void {
    this.actionClicked.emit({ actionName: action, offenceId: this.offenceId });
  }
}
