import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { IOpalFinesDefendantAccountAddress } from '@services/fines/opal-fines-service/interfaces/opal-fines-defendant-account.interface';

@Component({
  selector: 'app-fines-acc-address',
  imports: [UpperCasePipe],
  templateUrl: './fines-acc-address.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccAddressComponent {
  readonly address = input.required<IOpalFinesDefendantAccountAddress>();
}
