import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FinesMacFormParentBaseComponent } from '../abstract/fines-mac-form-parent-base';
import { IFinesMacContactDetailsForm } from './interfaces/fines-mac-contact-details-form.interface';
import { FinesMacContactDetailsFormComponent } from './fines-mac-contact-details-form/fines-mac-contact-details-form.component';

@Component({
  selector: 'app-fines-mac-contact-details',
  imports: [FinesMacContactDetailsFormComponent],
  templateUrl: './fines-mac-contact-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacContactDetailsComponent extends FinesMacFormParentBaseComponent {
  /**
   * Handles the form submission for contact details.
   * @param formData - The form data containing the search parameters.
   */
  public handleContactDetailsSubmit(form: IFinesMacContactDetailsForm): void {
    this.finesMacStore.setContactDetails(form);
    if (form.nestedFlow) {
      this.navigateToNestedRoute('contactDetails');
      return;
    }

    this.navigateToAccountDetails();
  }
}
