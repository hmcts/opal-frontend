import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IAbstractFormControlErrorMessage } from '@components/abstract/interfaces/abstract-form-control-error-message.interface';
import { GovukTextInputComponent } from '@components/govuk/govuk-text-input/govuk-text-input.component';

@Component({
  selector: 'app-fines-mac-national-insurance-number',
  standalone: true,
  imports: [GovukTextInputComponent],
  templateUrl: './fines-mac-national-insurance-number.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacNationalInsuranceNumberComponent {
  @Input({ required: true }) form!: FormGroup;
  @Input({ required: true }) formControlErrorMessages!: IAbstractFormControlErrorMessage;
  @Input({ required: true }) componentName!: string;
}
