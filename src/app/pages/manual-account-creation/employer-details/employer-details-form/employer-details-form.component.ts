import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  GovukTextInputComponent,
  GovukBackLinkComponent,
  GovukButtonComponent,
  GovukErrorSummaryComponent,
  FormBaseComponent,
} from '@components';
import { ManualAccountCreationRoutes } from '@enums';
import { IManualAccountCreationEmployerDetailsState, IFieldErrors } from '@interfaces';
import { StateService } from '@services';

@Component({
  selector: 'app-employer-details-form',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    GovukTextInputComponent,
    RouterModule,
    GovukBackLinkComponent,
    GovukButtonComponent,
    GovukErrorSummaryComponent,
  ],
  templateUrl: './employer-details-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployerDetailsFormComponent extends FormBaseComponent implements OnInit {
  @Input() public override form!: FormGroup;
  @Output() private employerDetailsFormSubmit = new EventEmitter<IManualAccountCreationEmployerDetailsState>();

  private readonly router = inject(Router);
  public readonly stateService = inject(StateService).manualAccountCreation.employerDetails;
  public readonly manualAccountCreationRoutes = ManualAccountCreationRoutes;

  // We will move this to a constant field in the future
  override fieldErrors: IFieldErrors = {
    employerName: {
      required: {
        message: 'Enter employer name',
        priority: 1,
      },
      maxlength: {
        message: 'The employer name must be 35 characters or fewer',
        priority: 2,
      },
    },
    employeeReference: {
      required: {
        message: 'Enter employee reference or National Insurance number',
        priority: 1,
      },
      maxlength: {
        message: 'The employee reference must be 20 characters or fewer',
        priority: 2,
      },
    },
    employerEmailAddress: {
      maxlength: {
        message: 'The employer email address must be 76 characters or fewer',
        priority: 2,
      },
      emailPattern: {
        message: 'Enter employer email address in the correct format like, name@example.com',
        priority: 2,
      },
    },
    employerTelephone: {
      maxlength: {
        message: 'Enter employer telephone number in the correct format',
        priority: 1,
      },
      phoneNumberPattern: {
        message: 'Enter employer telephone number in the correct format',
        priority: 2,
      },
    },
    employerAddress1: {
      required: {
        message: 'Enter address line 1, typically the building and street',
        priority: 1,
      },
      maxlength: {
        message: 'The employer address line 1 must be 30 characters or fewer',
        priority: 2,
      },
      specialCharactersPattern: {
        message: 'The employer address line 1 must not contain special characters',
        priority: 3,
      },
    },
    employerAddress2: {
      maxlength: {
        message: 'The employer address line 2 must be 30 characters or fewer',
        priority: 1,
      },
      specialCharactersPattern: {
        message: 'The employer address line 2 must not contain special characters',
        priority: 2,
      },
    },
    employerAddress3: {
      maxlength: {
        message: 'The employer address line 3 must be 30 characters or fewer',
        priority: 1,
      },
      specialCharactersPattern: {
        message: 'The employer address line 3 must not contain special characters',
        priority: 2,
      },
    },
    employerAddress4: {
      maxlength: {
        message: 'The employer address line 4 must be 30 characters or fewer',
        priority: 1,
      },
      specialCharactersPattern: {
        message: 'The employer address line 4 must not contain special characters',
        priority: 2,
      },
    },
    employerAddress5: {
      maxlength: {
        message: 'The employer address line 5 must be 30 characters or fewer',
        priority: 1,
      },
      specialCharactersPattern: {
        message: 'The employer address line 5 must not contain special characters',
        priority: 2,
      },
    },
    employerPostcode: {
      maxlength: {
        message: 'The employer postcode must be 8 characters or fewer',
        priority: 1,
      },
    },
  };

  /**
   * Handles back and navigates to the manual account creation page.
   */
  public handleBack(): void {
    this.router.navigate([ManualAccountCreationRoutes.createAccount]);
  }

  /**
   * Handles the form submission event.
   */
  public handleFormSubmit(): void {
    this['handleErrorMessages']();

    if (this.form.valid) {
      this.employerDetailsFormSubmit.emit(this.form.value);
    }
  }

  public ngOnInit(): void {
    this['setInitialErrorMessages']();
    this['rePopulateForm'](this.stateService);
  }
}
