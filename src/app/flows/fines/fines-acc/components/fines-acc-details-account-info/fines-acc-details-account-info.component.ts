import { UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CustomAccountInformationComponent } from '@hmcts/opal-frontend-common/components/custom/custom-account-information';
import { CustomAccountInformationItemComponent } from '@hmcts/opal-frontend-common/components/custom/custom-account-information/custom-account-information-item';
import { CustomAccountInformationItemLabelComponent } from '@hmcts/opal-frontend-common/components/custom/custom-account-information/custom-account-information-item/custom-account-information-item-label';
import { CustomAccountInformationItemValueComponent } from '@hmcts/opal-frontend-common/components/custom/custom-account-information/custom-account-information-item/custom-account-information-item-value';
import { IOpalFinesDefendantAccountHeader } from '../../fines-acc-defendant-details/interfaces/fines-acc-defendant-account-header.interface';

@Component({
  selector: 'app-fines-acc-details-account-info',
  imports: [
    CustomAccountInformationComponent,
    CustomAccountInformationItemComponent,
    CustomAccountInformationItemLabelComponent,
    CustomAccountInformationItemValueComponent,
    UpperCasePipe,
  ],
  templateUrl: './fines-acc-details-account-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccDetailsAccountInfoComponent {
  @Input() accountData!: IOpalFinesDefendantAccountHeader;
}
