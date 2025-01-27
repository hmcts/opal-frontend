import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-govuk-summary-card-list',

  imports: [],
  templateUrl: './govuk-summary-card-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukSummaryCardListComponent implements OnInit {
  @Input({ required: true }) summaryCardListId!: string;
  @Input({ required: false }) cardTitle!: string;
  @Input({ required: false }) contentHidden!: boolean;

  public id!: string;

  private setId(): void {
    this.id = this.summaryCardListId + '-summary-card-list';
  }

  public ngOnInit(): void {
    this.setId();
  }
}
