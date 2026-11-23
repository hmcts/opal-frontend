import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-fines-suspense-item-results-not-found',
  templateUrl: './fines-suspense-item-results-not-found.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesSuspenseItemResultsNotFoundComponent {
  public readonly businessUnitName = input.required<string>();
}
