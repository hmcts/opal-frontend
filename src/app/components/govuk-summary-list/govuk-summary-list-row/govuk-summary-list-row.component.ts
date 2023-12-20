import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-govuk-summary-list-row',
  standalone: true,
  imports: [],
  templateUrl: './govuk-summary-list-row.component.html',
  styleUrl: './govuk-summary-list-row.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukSummaryListRowComponent {
  @Output() public actionClick = new EventEmitter<boolean>();
  @Input() public actionEnabled = false;

  public handleActionClick(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this, this.actionClick.emit(true);
  }
}
