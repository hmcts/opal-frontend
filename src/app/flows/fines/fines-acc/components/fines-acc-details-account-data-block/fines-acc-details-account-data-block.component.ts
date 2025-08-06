import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-fines-acc-details-account-data-block',
  imports: [JsonPipe],
  templateUrl: './fines-acc-details-account-data-block.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccDetailsAccountDataBlockComponent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() blockData: any; // Replace 'any' with the appropriate type for accountData
}
