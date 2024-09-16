import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { GovukTextInputComponent } from '@components/govuk/govuk-text-input/govuk-text-input.component';
import { IFinesMacAddressFieldIds } from './interfaces';
import { IAbstractFormControlErrorMessage } from '@interfaces/components/abstract';

@Component({
  selector: 'app-fines-mac-address-block',
  standalone: true,
  imports: [GovukTextInputComponent],
  templateUrl: './fines-mac-address-block.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacAddressBlockComponent {
  @Input({ required: false }) divider!: boolean;
  @Input({ required: true }) legendText!: string;
  @Input({ required: true }) form!: FormGroup;
  @Input({ required: true }) formControlErrorMessages!: IAbstractFormControlErrorMessage;
  @Input({ required: true }) addressFieldIds!: IFinesMacAddressFieldIds;
  @Input({ required: true }) componentName!: string;
}
