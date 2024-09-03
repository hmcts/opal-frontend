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
import { AbstractFormBaseComponent } from '@components/abstract';
import { AlphagovAccessibleAutocompleteComponent } from '@components/alphagov';
import {
  GovukButtonComponent,
  GovukCancelLinkComponent,
  GovukErrorSummaryComponent,
  GovukTextInputComponent,
} from '@components/govuk';

import { IAbstractFormBaseFieldErrors } from '@interfaces/components/abstract';
import { IAlphagovAccessibleAutocompleteItem } from '@interfaces/components/alphagov';
import { IFinesMacCourtDetailsForm } from '../interfaces';
import { FinesService } from '@services/fines';
import { FINES_MAC_COURT_DETAILS_FIELD_ERRORS } from '../constants';
import { FINES_MAC_ROUTING_NESTED_ROUTES, FINES_MAC_ROUTING_PATHS } from '../../routing/constants';

@Component({
  selector: 'app-fines-mac-court-details-form',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    AlphagovAccessibleAutocompleteComponent,
    GovukButtonComponent,
    GovukCancelLinkComponent,
    GovukTextInputComponent,
    GovukErrorSummaryComponent,
  ],
  templateUrl: './fines-mac-court-details-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacCourtDetailsFormComponent extends AbstractFormBaseComponent implements OnInit, OnDestroy {
  @Input() public defendantType!: string;
  @Input({ required: true }) public sendingCourtAutoCompleteItems!: IAlphagovAccessibleAutocompleteItem[];
  @Input({ required: true }) public enforcingCourtAutoCompleteItems!: IAlphagovAccessibleAutocompleteItem[];
  @Output() protected override formSubmit = new EventEmitter<IFinesMacCourtDetailsForm>();

  protected readonly finesService = inject(FinesService);
  protected readonly fineMacRoutingPaths = FINES_MAC_ROUTING_PATHS;
  protected readonly finesMacNestedRoutes = FINES_MAC_ROUTING_NESTED_ROUTES;

  override fieldErrors: IAbstractFormBaseFieldErrors = FINES_MAC_COURT_DETAILS_FIELD_ERRORS;

  /**
   * Sets up the court details form with the necessary form controls.
   */
  private setupCourtDetailsForm(): void {
    this.form = new FormGroup({
      SendingCourt: new FormControl(null, [Validators.required]),
      ProsecutorCaseReference: new FormControl(null, [
        Validators.required,
        Validators.maxLength(30),
        Validators.pattern(/^[a-zA-Z0-9 ]*$/),
      ]),
      EnforcingCourt: new FormControl(null, [Validators.required]),
    });
  }

  /**
   * Performs the initial setup for the court details form.
   * This method sets up the court details form, initializes error messages,
   * and repopulates the form with the initial court details data.
   */
  private initialCourtDetailsSetup(): void {
    const { formData } = this.finesService.finesMacState.courtDetails;
    this.setupCourtDetailsForm();
    this.setInitialErrorMessages();
    this.rePopulateForm(formData);
  }

  public override ngOnInit(): void {
    this.initialCourtDetailsSetup();
    super.ngOnInit();
  }
}
