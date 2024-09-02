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
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  GovukButtonComponent,
  GovukCancelLinkComponent,
  GovukErrorSummaryComponent,
  GovukTextInputComponent,
} from '@components/govuk';
import { AbstractFormBaseComponent } from '@components/abstract';
import { optionalMaxLengthValidator, optionalEmailAddressValidator, optionalPhoneNumberValidator } from '@validators';
import { IFinesMacContactDetailsFieldErrors, IFinesMacContactDetailsForm } from '../interfaces';

import { FinesService } from '@services/fines';
import { FINES_MAC_CONTACT_DETAILS_FIELD_ERRORS } from '../constants';
import { FINES_MAC_ROUTING_NESTED_ROUTES, FINES_MAC_ROUTING_PATHS } from '../../routing/constants';

@Component({
  selector: 'app-fines-mac-contact-details-form',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    GovukTextInputComponent,
    GovukButtonComponent,
    GovukErrorSummaryComponent,
    GovukCancelLinkComponent,
  ],
  templateUrl: './fines-mac-contact-details-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacContactDetailsFormComponent extends AbstractFormBaseComponent implements OnInit, OnDestroy {
  @Input() public defendantType!: string;
  @Output() protected override formSubmit = new EventEmitter<IFinesMacContactDetailsForm>();

  protected readonly finesService = inject(FinesService);
  protected readonly fineMacRoutingPaths = FINES_MAC_ROUTING_PATHS;
  protected readonly finesMacNestedRoutes = FINES_MAC_ROUTING_NESTED_ROUTES;

  override fieldErrors: IFinesMacContactDetailsFieldErrors = FINES_MAC_CONTACT_DETAILS_FIELD_ERRORS;

  /**
   * Sets up the contact details form with the necessary form controls.
   */
  private setupContactDetailsForm(): void {
    this.form = new FormGroup({
      email_address_1: new FormControl(null, [optionalMaxLengthValidator(76), optionalEmailAddressValidator()]),
      email_address_2: new FormControl(null, [optionalMaxLengthValidator(76), optionalEmailAddressValidator()]),
      telephone_number_mobile: new FormControl(null, [optionalMaxLengthValidator(35), optionalPhoneNumberValidator()]),
      telephone_number_home: new FormControl(null, [optionalMaxLengthValidator(35), optionalPhoneNumberValidator()]),
      telephone_number_business: new FormControl(null, [
        optionalMaxLengthValidator(35),
        optionalPhoneNumberValidator(),
      ]),
    });
  }

  /**
   * Performs the initial setup for the fines-mac-contact-details-form component.
   * This method sets up the contact details form, initializes error messages, and populates the form with data.
   */
  private initialContactDetailsSetup(): void {
    this.setupContactDetailsForm();
    this.setInitialErrorMessages();
    this.rePopulateForm(this.finesService.finesMacState.contactDetails);
  }

  public override ngOnInit(): void {
    this.initialContactDetailsSetup();
    super.ngOnInit();
  }
}
