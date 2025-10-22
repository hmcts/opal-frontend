import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FINES_DEFAULT_VALUES } from '../../../../constants/fines-default-values.constant';
import { FinesNotProvidedComponent } from '../../../../components/fines-not-provided/fines-not-provided.component';
import { FinesSaResultsSharedTableCellType } from './types/fines-sa-results-shared-table-cell.type';

@Component({
  selector: 'app-fines-sa-results-shared-table-cell',
  imports: [CommonModule, FinesNotProvidedComponent],
  template: `
    @if (shouldShowNoData()) {
      <app-fines-not-provided></app-fines-not-provided>
    } @else {
      <ng-content></ng-content>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesSaResultsSharedTableCellComponent {
  protected readonly finesDefaultValues = FINES_DEFAULT_VALUES;

  @Input() value: FinesSaResultsSharedTableCellType;

  /**
   * Determines if the no data template should be shown
   */
  protected shouldShowNoData(): boolean {
    return this.value === null || this.value === undefined || (Array.isArray(this.value) && this.value.length === 0);
  }
}
