import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IFinesMacVehicleDetailsFieldIds } from './interfaces/fines-mac-vehicle-details-field-ids';
import { FormGroup } from '@angular/forms';
import { IAbstractFormControlErrorMessage } from '@interfaces/components/abstract';
import { GovukTextInputComponent } from '@components/govuk';

@Component({
  selector: 'app-fines-mac-vehicle-details',
  standalone: true,
  imports: [GovukTextInputComponent],
  templateUrl: './fines-mac-vehicle-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacVehicleDetailsComponent {
  @Input({ required: false }) divider!: boolean;
  @Input({ required: true }) legendText!: string;
  @Input({ required: true }) form!: FormGroup;
  @Input({ required: true }) formControlErrorMessages!: IAbstractFormControlErrorMessage;
  @Input({ required: true }) vehicleDetailsFieldIds!: IFinesMacVehicleDetailsFieldIds;
  @Input({ required: true }) componentName!: string;
}
