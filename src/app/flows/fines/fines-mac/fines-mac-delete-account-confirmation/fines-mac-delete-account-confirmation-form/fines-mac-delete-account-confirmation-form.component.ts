import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AbstractFormBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base';
import { GovukButtonComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-button';
import { GovukCancelLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-cancel-link';
import { GovukTextAreaComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-text-area';
import { FINES_MAC_ROUTING_PATHS } from '../../routing/constants/fines-mac-routing-paths.constant';
import { FINES_MAC_ROUTING_NESTED_ROUTES } from '../../routing/constants/fines-mac-routing-nested-routes.constant';
import { CommonModule } from '@angular/common';
import { FinesMacStore } from '../../stores/fines-mac.store';
import { IFinesMacDeleteAccountConfirmationForm } from '../interfaces/fines-mac-delete-account-confirmation-form.interface';
import { IFinesMacDeleteAccountConfirmationFieldErrors } from '../interfaces/fines-mac-delete-account-confirmation-field-errors.interface';
import { FINES_MAC_DELETE_ACCOUNT_CONFIRMATION_FIELD_ERRORS } from '../constants/fines-mac-delete-account-confirmation-field-errors.constant';
import { optionalMaxLengthValidator } from '@hmcts/opal-frontend-common/validators/optional-max-length';
import { alphabeticalTextValidator } from '@hmcts/opal-frontend-common/validators/alphabetical-text';

@Component({
  selector: 'app-fines-mac-delete-account-confirmation-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GovukButtonComponent,
    GovukCancelLinkComponent,
    GovukTextAreaComponent,
  ],
  templateUrl: './fines-mac-delete-account-confirmation-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacDeleteAccountConfirmationFormComponent extends AbstractFormBaseComponent implements OnInit, OnDestroy {
  @Input({ required: true }) public referer!: string;
  @Output() protected override formSubmit = new EventEmitter<IFinesMacDeleteAccountConfirmationForm>();

  public readonly finesMacStore = inject(FinesMacStore);
  protected readonly fineMacRoutingPaths = FINES_MAC_ROUTING_PATHS;
  protected readonly finesMacNestedRoutes = FINES_MAC_ROUTING_NESTED_ROUTES;
  override fieldErrors: IFinesMacDeleteAccountConfirmationFieldErrors = FINES_MAC_DELETE_ACCOUNT_CONFIRMATION_FIELD_ERRORS;

  /**
   * Sets up the delete account confirmation form with the necessary form controls.
   */
  private setupDeleteAccountConfirmationForm(): void {
    this.form = new FormGroup({
      fm_delete_account_confirmation_reason: new FormControl<string | null>(null, [Validators.required, optionalMaxLengthValidator(250), alphabeticalTextValidator()]),
    });
  }

  /**
   * Performs the initial setup for the fines-mac-delete-account-confirmation-form component.
   * This method sets up the delete account confirmation form, and populates the form with data.
   */
  private initialDeleteAccountConfirmationSetup(): void {
    const { formData } = this.finesMacStore.deleteAccountConfirmation();
    this.setupDeleteAccountConfirmationForm();
    this.setInitialErrorMessages();
    this.rePopulateForm(formData);
  }

  public override ngOnInit(): void {
    this.initialDeleteAccountConfirmationSetup();
    super.ngOnInit();
  }
}
