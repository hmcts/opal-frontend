import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { UtilsService } from '@hmcts/opal-frontend-common/core/services';

@Component({
  selector: 'app-govuk-summary-list-row, [app-govuk-summary-list-row]',
  imports: [],
  templateUrl: './govuk-summary-list-row.component.html',
  styleUrl: './govuk-summary-list-row.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukSummaryListRowComponent implements OnInit {
  private readonly utilService = inject(UtilsService);
  public _summaryListRowId!: string;

  @Output() public actionClick = new EventEmitter<boolean>();
  @Input() public actionEnabled = false;

  @Input({ required: true }) summaryListId!: string;
  @Input({ required: true }) set summaryListRowId(summaryListRowId: string) {
    this._summaryListRowId = this.utilService.upperCaseFirstLetter(summaryListRowId);
  }

  // We need to set the class and id on the host div element
  // A div needs to be passed, otherwise we will get https://dequeuniversity.com/rules/axe/4.8/definition-list?application=RuleDescription
  // As it doesn't like nested divs
  @HostBinding('class') class!: string;
  @HostBinding('id') id!: string;

  /**
   * Handles the click event for the action button.
   * @param event - The click event.
   */
  public handleActionClick(event: Event): void {
    event.preventDefault();
    this.actionClick.emit(true);
  }

  ngOnInit() {
    this.id = this.summaryListId + this._summaryListRowId;
    this.class = 'govuk-summary-list__row';
  }
}
