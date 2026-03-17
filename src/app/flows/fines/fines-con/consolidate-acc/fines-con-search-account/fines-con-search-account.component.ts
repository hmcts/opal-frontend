import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinesConSearchAccountFormComponent } from './fines-con-search-account-form/fines-con-search-account-form.component';
import { IFinesConSearchAccountForm } from './interfaces/fines-con-search-account-form.interface';
import { FinesConDefendant } from '../../types/fines-con-defendant.type';
import { FinesConStore } from '../../stores/fines-con.store';
import { FinesConPayloadService } from '../../services/fines-con-payload.service';
import { IOpalFinesDefendantAccountSearchParams } from '@services/fines/opal-fines-service/interfaces/opal-fines-defendant-account-search-params.interface';

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
  private readonly finesConPayloadService = inject(FinesConPayloadService);
  @Input({ required: true }) defendantType: FinesConDefendant = 'individual';
  @Output() public searchPayload = new EventEmitter<IOpalFinesDefendantAccountSearchParams>();

  /**
   * Handles the search account form submission.
   * Stores the form data in the store and updates unsaved changes state.
   * This method should be extended in the future to navigate to results tab with the searched account data.
   *
   * @param form - The submitted search form data
   */
  public handleSearchAccountSubmit(form: IFinesConSearchAccountForm): void {
    const payload = this.finesConPayloadService.buildDefendantAccountsSearchPayload(
      form.formData,
      this.finesConStore.getBusinessUnitId(),
      this.defendantType,
    );

    this.finesConStore.updateSearchAccountFormTemporary(form.formData);
    this.finesConStore.setUnsavedChanges(false);
    this.finesConStore.setActiveTab('results');
    this.searchPayload.emit(payload);
  }

  /**
   * Updates the internal and store state to track unsaved changes.
   * @param unsavedChanges - Boolean flag indicating if the form has unsaved changes.
   */
  public handleUnsavedChanges(unsavedChanges: boolean): void {
    this.finesConStore.setUnsavedChanges(unsavedChanges);
  }
}
