import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { GovukTextInputComponent } from '@components/govuk';
import { ICustomAddressFieldIds } from '@interfaces/components/custom';
import { IAbstractFormControlErrorMessage } from '@interfaces/components/abstract';

@Component({
  selector: 'app-custom-address-block',
  standalone: true,
  imports: [GovukTextInputComponent],
  templateUrl: './custom-address-block.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomAddressBlockComponent {
  @Input({ required: false }) divider!: boolean;
  @Input({ required: true }) legendText!: string;
  @Input({ required: true }) form!: FormGroup;
  @Input({ required: true }) formControlErrorMessages!: IAbstractFormControlErrorMessage;
  @Input({ required: true }) addressFieldIds!: ICustomAddressFieldIds;
}
