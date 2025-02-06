import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FinesMacOffenceDetailsMinorCreditorFormComponent } from './fines-mac-offence-details-minor-creditor-form/fines-mac-offence-details-minor-creditor-form.component';
import { AbstractFormParentBaseComponent } from '@components/abstract/abstract-form-parent-base/abstract-form-parent-base.component';
import { IFinesMacOffenceDetailsMinorCreditorForm } from './interfaces/fines-mac-offence-details-minor-creditor-form.interface';
import { FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS } from '../routing/constants/fines-mac-offence-details-routing-paths.constant';
import { FinesMacStore } from '../../stores/fines-mac.store';
import { FinesMacOffenceDetailsStore } from '../stores/fines-mac-offence-details.store';

@Component({
  selector: 'app-fines-mac-offence-details-minor-creditor',
  imports: [FinesMacOffenceDetailsMinorCreditorFormComponent],
  templateUrl: './fines-mac-offence-details-minor-creditor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacOffenceDetailsMinorCreditorComponent
  extends AbstractFormParentBaseComponent
  implements OnInit, OnDestroy
{
  public finesMacOffenceDetailsStore = inject(FinesMacOffenceDetailsStore);
  public finesMacStore = inject(FinesMacStore);

  /**
   * Handles the submission of the minor creditor form.
   *
   * @param {IFinesMacOffenceDetailsMinorCreditorForm} form - The form data for the minor creditor.
   *
   * Updates the imposition position in the form data, sets the form status as provided,
   * pushes the form data to the offence details draft state, sets the minor creditor added flag,
   * and navigates to the add offence route.
   */
  public handleMinorCreditorFormSubmit(form: IFinesMacOffenceDetailsMinorCreditorForm): void {
    // Update the imposition position in the form data
    const removeMinorCreditor = this.finesMacOffenceDetailsStore.removeMinorCreditor();
    const offenceDetailsDraft = structuredClone(this.finesMacOffenceDetailsStore.offenceDetailsDraft());
    form.formData.fm_offence_details_imposition_position =
      removeMinorCreditor ?? this.finesMacOffenceDetailsStore.rowIndex();

    // If childFormData exists and has at least one item in
    const { childFormData } = offenceDetailsDraft[0];

    if (childFormData && childFormData.length > 0) {
      const minorCreditor = childFormData.find(
        (childFormData) => childFormData.formData.fm_offence_details_imposition_position === removeMinorCreditor,
      );
      if (minorCreditor) {
        minorCreditor.formData = form.formData;
      } else {
        childFormData.push(form);
      }
    } else {
      offenceDetailsDraft[0].childFormData = [form];
    }

    this.finesMacOffenceDetailsStore.setOffenceDetailsDraft(offenceDetailsDraft);
    this.finesMacOffenceDetailsStore.setMinorCreditorAdded(true);

    this.routerNavigate(FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.addOffence);
  }

  /**
   * Handles unsaved changes coming from the child component
   *
   * @param unsavedChanges boolean value from child component
   */
  public handleUnsavedChanges(unsavedChanges: boolean): void {
    this.finesMacStore.setUnsavedChanges(unsavedChanges);
    this.stateUnsavedChanges = unsavedChanges;
  }

  public ngOnInit(): void {
    this.finesMacOffenceDetailsStore.setOffenceCodeMessage('');
  }

  public ngOnDestroy(): void {
    this.finesMacOffenceDetailsStore.setRemoveMinorCreditor(null);
  }
}
