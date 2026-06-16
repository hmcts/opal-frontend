import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FinesMacFormParentBaseComponent } from '../abstract/fines-mac-form-parent-base';
import { IFinesMacParentGuardianDetailsForm } from './interfaces/fines-mac-parent-guardian-details-form.interface';

import { RouterModule } from '@angular/router';
import { FinesMacParentGuardianDetailsFormComponent } from './fines-mac-parent-guardian-details-form/fines-mac-parent-guardian-details-form.component';

@Component({
  selector: 'app-fines-mac-parent-guardian-details',
  imports: [RouterModule, FinesMacParentGuardianDetailsFormComponent],
  templateUrl: './fines-mac-parent-guardian-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacParentGuardianDetailsComponent extends FinesMacFormParentBaseComponent {
  /**
   * Handles the form submission for parent/guardian details.
   * @param formData - The form data containing the search parameters.
   */
  public handleParentGuardianDetailsSubmit(form: IFinesMacParentGuardianDetailsForm): void {
    this.finesMacStore.setParentGuardianDetails(form);
    if (form.nestedFlow) {
      this.navigateToNestedRoute('parentOrGuardianDetails');
      return;
    }

    this.navigateToAccountDetails();
  }
}
