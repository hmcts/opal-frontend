import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { UtilsService } from '@services';

@Component({
  selector: 'app-govuk-summary-list',
  standalone: true,
  imports: [],
  templateUrl: './govuk-summary-list.component.html',
  styleUrl: './govuk-summary-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukSummaryListComponent {
  public _summaryListId!: string;
  private readonly utilService = inject(UtilsService);

  @Input({ required: true }) set summaryListId(summaryListId: string) {
    this._summaryListId = this.utilService.upperCaseFirstLetter(summaryListId);
  }
}
