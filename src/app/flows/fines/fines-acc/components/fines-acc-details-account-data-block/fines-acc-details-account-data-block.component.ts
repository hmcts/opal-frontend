import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-fines-acc-details-account-data-block',
  imports: [],
  templateUrl: './fines-acc-details-account-data-block.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccDetailsAccountDataBlockComponent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() tabData: any; // Replace 'any' with the appropriate type for accountData
}
