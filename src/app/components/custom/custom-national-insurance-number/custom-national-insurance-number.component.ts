import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IAbstractFormControlErrorMessage } from '@interfaces/components/abstract';
import { GovukTextInputComponent } from '@components/govuk';

@Component({
  selector: 'app-custom-national-insurance-number',
  standalone: true,
  imports: [GovukTextInputComponent],
  templateUrl: './custom-national-insurance-number.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomNationalInsuranceNumberComponent {
  @Input({ required: true }) form!: FormGroup;
  @Input({ required: true }) formControlErrorMessages!: IAbstractFormControlErrorMessage;
}
