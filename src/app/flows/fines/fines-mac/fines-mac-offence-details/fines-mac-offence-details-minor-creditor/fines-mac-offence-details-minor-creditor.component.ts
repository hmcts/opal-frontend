import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FinesMacOffenceDetailsMinorCreditorFormComponent } from './fines-mac-offence-details-minor-creditor-form/fines-mac-offence-details-minor-creditor-form.component';
import { AbstractFormParentBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-parent-base';
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
  private readonly finesMacOffenceDetailsStore = inject(FinesMacOffenceDetailsStore);
  private readonly finesMacStore = inject(FinesMacStore);

  /**
   * Determines whether the submitted minor creditor differs from the existing stored creditor.
   *
   * @param existingCreditor - The currently stored minor creditor for the imposition, if one exists.
   * @param submittedCreditor - The minor creditor submitted from the child form.
   * @returns `true` when the creditor is new or the submitted form data differs from the stored data.
   */
  private creditorFormChanged(
    existingCreditor: IFinesMacOffenceDetailsMinorCreditorForm | undefined,
    submittedCreditor: IFinesMacOffenceDetailsMinorCreditorForm,
  ): boolean {
    if (!existingCreditor) {
      return true;
    }

    return JSON.stringify(existingCreditor.formData) !== JSON.stringify(submittedCreditor.formData);
  }

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
    const offenceDetailsDraftDirty = this.finesMacOffenceDetailsStore.offenceDetailsDraftDirty();
    const unsavedChanges = this.finesMacStore.unsavedChanges();
    form.formData.fm_offence_details_imposition_position =
      removeMinorCreditor ?? this.finesMacOffenceDetailsStore.rowIndex();

    // If childFormData exists and has at least one item in
    const { childFormData } = offenceDetailsDraft[0];
    let hasCreditorChanges = true;

    if (childFormData && childFormData.length > 0) {
      const minorCreditor = childFormData.find(
        (childFormData) => childFormData.formData.fm_offence_details_imposition_position === removeMinorCreditor,
      );
      hasCreditorChanges = this.creditorFormChanged(minorCreditor, form);
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
    this.finesMacOffenceDetailsStore.setOffenceDetailsDraftDirty(offenceDetailsDraftDirty || hasCreditorChanges);
    this.finesMacStore.setUnsavedChanges(offenceDetailsDraftDirty || unsavedChanges || hasCreditorChanges);

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
