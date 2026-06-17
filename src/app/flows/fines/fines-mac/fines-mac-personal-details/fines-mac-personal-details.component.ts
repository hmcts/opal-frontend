import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FinesMacFormParentBaseComponent } from '../abstract/fines-mac-form-parent-base';
import { IFinesMacPersonalDetailsForm } from './interfaces/fines-mac-personal-details-form.interface';
import { FinesMacPersonalDetailsFormComponent } from './fines-mac-personal-details-form/fines-mac-personal-details-form.component';

@Component({
  selector: 'app-fines-mac-personal-details',
  imports: [FinesMacPersonalDetailsFormComponent],
  templateUrl: './fines-mac-personal-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacPersonalDetailsComponent extends FinesMacFormParentBaseComponent {
  /**
   * Handles the submission of personal details form.
   *
   * @param form - The personal details form data.
   * @returns void
   */
  public handlePersonalDetailsSubmit(form: IFinesMacPersonalDetailsForm): void {
    this.finesMacStore.setPersonalDetails(form);
    if (form.nestedFlow && this.navigateToNestedRoute('personalDetails')) {
      return;
    }

    this.navigateToAccountDetails();
  }
}
