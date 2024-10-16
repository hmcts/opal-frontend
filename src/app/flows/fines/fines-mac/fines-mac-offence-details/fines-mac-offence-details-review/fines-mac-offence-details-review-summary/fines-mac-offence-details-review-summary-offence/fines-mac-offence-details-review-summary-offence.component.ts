import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { IOpalFinesOffencesRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-offences-ref-data.interface';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { EMPTY, Observable, map } from 'rxjs';
import { FinesMacOffenceDetailsReviewSummaryOffenceTitleComponent } from './fines-mac-offence-details-review-summary-offence-title/fines-mac-offence-details-review-summary-offence-title.component';

@Component({
  selector: 'app-fines-mac-offence-details-review-summary-offence',
  standalone: true,
  imports: [CommonModule, FinesMacOffenceDetailsReviewSummaryOffenceTitleComponent],
  templateUrl: './fines-mac-offence-details-review-summary-offence.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacOffenceDetailsReviewSummaryOffenceComponent implements OnInit {
  @Input({ required: true }) public offenceCode!: string;
  @Output() public actionClicked = new EventEmitter<string>();

  private readonly opalFinesService = inject(OpalFines);

  public offenceRefData$: Observable<IOpalFinesOffencesRefData> = EMPTY;

  private getOffenceRefData(): void {
    this.offenceRefData$ = this.opalFinesService.getOffenceByCjsCode(this.offenceCode).pipe(map((result) => result));
  }

  public onActionClick(action: string): void {
    this.actionClicked.emit(action);
  }

  public ngOnInit(): void {
    this.getOffenceRefData();
  }
}
