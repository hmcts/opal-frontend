import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinesConSearchAccountFormComponent } from './fines-con-search-account-form/fines-con-search-account-form.component';
import { IFinesConSearchAccountForm } from './interfaces/fines-con-search-account-form.interface';
import { IFinesConDefendantType } from '../../interfaces/fines-con-defendant-type.interface';
import { FinesConStore } from '../../stores/fines-con.store';

/**
 * Container component for the search account form.
 * Displays within the search tab of the consolidate accounts page.
 */
@Component({
  selector: 'app-fines-con-search-account',
  standalone: true,
  imports: [CommonModule, FinesConSearchAccountFormComponent],
  templateUrl: './fines-con-search-account.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesConSearchAccountComponent {
  private readonly finesConStore = inject(FinesConStore);
  @Input({ required: true }) defendantType: IFinesConDefendantType = 'individual';

  /**
   * Handles the search account form submission.
   * Stores the form data in the store and updates unsaved changes state.
   * This method should be extended in the future to navigate to results tab with the searched account data.
   *
   * @param form - The submitted search form data
   */
  handleSearchAccountSubmit(form: IFinesConSearchAccountForm): void {
    this.finesConStore.updateSearchAccountFormTemporary(form.formData);
    this.finesConStore.setUnsavedChanges(false);
  }

  /**
   * Updates the internal and store state to track unsaved changes.
   * @param unsavedChanges - Boolean flag indicating if the form has unsaved changes.
   */
  handleUnsavedChanges(unsavedChanges: boolean): void {
    this.finesConStore.setUnsavedChanges(unsavedChanges);
  }
}
