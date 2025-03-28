import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FINES_MAC_ROUTING_PATHS } from '../routing/constants/fines-mac-routing-paths.constant';
import { AbstractFormParentBaseComponent } from '@hmcts/opal-frontend-common/components/abstract';
import { IFinesMacLanguagePreferencesForm } from './interfaces/fines-mac-language-preferences-form.interface';
import { FinesMacLanguagePreferencesFormComponent } from './fines-mac-language-preferences-form/fines-mac-language-preferences-form.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FinesMacStore } from '../stores/fines-mac.store';

@Component({
  selector: 'app-fines-mac-language-preferences',
  imports: [CommonModule, RouterModule, FinesMacLanguagePreferencesFormComponent],
  templateUrl: './fines-mac-language-preferences.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacLanguagePreferencesComponent extends AbstractFormParentBaseComponent {
  private readonly finesMacStore = inject(FinesMacStore);
  public readonly finesMacRoutingPaths = FINES_MAC_ROUTING_PATHS;

  /**
   * Handles the submission of language preferences form.
   * Updates the finesMacStore with the new language preferences,
   * sets unsavedChanges to false, and stateChanges to true.
   * Navigates to the account details page.
   *
   * @param languagePreferencesForm - The form data containing the language preferences.
   */
  public handleLanguagePreferencesSubmit(form: IFinesMacLanguagePreferencesForm): void {
    this.finesMacStore.setLanguagePreferences(form);

    this.routerNavigate(this.finesMacRoutingPaths.children.accountDetails);
  }

  /**
   * Handles the changes in unsaved state for the fines-mac-language-preferences component.
   * @param unsavedChanges - A boolean value indicating whether there are unsaved changes.
   */
  public handleUnsavedChanges(unsavedChanges: boolean): void {
    this.finesMacStore.setUnsavedChanges(unsavedChanges);
    this.stateUnsavedChanges = unsavedChanges;
  }
}
