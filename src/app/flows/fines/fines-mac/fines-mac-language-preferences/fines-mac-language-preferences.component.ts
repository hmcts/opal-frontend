import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FINES_MAC_ROUTING_PATHS } from '../routing/constants/fines-mac-routing-paths.constant';
import { AbstractFormParentBaseComponent } from '@components/abstract/abstract-form-parent-base/abstract-form-parent-base.component';
import { IFinesMacLanguagePreferencesForm } from './interfaces/fines-mac-language-preferences-form.interface';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { FinesMacLanguagePreferencesFormComponent } from './fines-mac-language-preferences-form/fines-mac-language-preferences-form.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-fines-mac-language-preferences',

  imports: [CommonModule, RouterModule, FinesMacLanguagePreferencesFormComponent],
  templateUrl: './fines-mac-language-preferences.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacLanguagePreferencesComponent extends AbstractFormParentBaseComponent {
  protected readonly finesService = inject(FinesService);

  public readonly finesMacRoutingPaths = FINES_MAC_ROUTING_PATHS;

  /**
   * Handles the submission of language preferences form.
   * Updates the finesMacState with the new language preferences,
   * sets unsavedChanges to false, and stateChanges to true.
   * Navigates to the account details page.
   *
   * @param languagePreferencesForm - The form data containing the language preferences.
   */
  public handleLanguagePreferencesSubmit(formSubmit: IFinesMacLanguagePreferencesForm): void {
    this.finesService.finesMacState = {
      ...this.finesService.finesMacState,
      languagePreferences: formSubmit,
      unsavedChanges: false,
      stateChanges: true,
    };

    this.routerNavigate(this.finesMacRoutingPaths.children.accountDetails);
  }

  /**
   * Handles the changes in unsaved state for the fines-mac-language-preferences component.
   * @param unsavedChanges - A boolean value indicating whether there are unsaved changes.
   */
  public handleUnsavedChanges(unsavedChanges: boolean): void {
    this.finesService.finesMacState.unsavedChanges = unsavedChanges;
    this.stateUnsavedChanges = unsavedChanges;
  }
}
