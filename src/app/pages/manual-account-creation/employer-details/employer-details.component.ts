import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { StateService } from '@services';
import { EmployerDetailsFormComponent } from './employer-details-form/employer-details-form.component';
import { IManualAccountCreationEmployerDetailsState } from '@interfaces';
import { ManualAccountCreationRoutes } from '@enums';
import { Observable } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  optionalMaxLengthValidator,
  optionalEmailAddressValidator,
  optionalPhoneNumberValidator,
  specialCharactersValidator,
} from 'src/app/validators';

@Component({
  selector: 'app-employer-details',
  standalone: true,
  imports: [CommonModule, RouterModule, EmployerDetailsFormComponent],
  templateUrl: './employer-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployerDetailsComponent implements OnInit {
  private readonly router = inject(Router);
  public readonly stateService = inject(StateService);

  public employerDetailsForm!: FormGroup;

  // @HostListener allows us to also guard against browser refresh, close, etc.
  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    if (this.employerDetailsForm.dirty && this.stateService.manualAccountCreation.employerDetails === null) {
      const controls = this.employerDetailsForm.controls;
      for (const controlName in controls) {
        const control = controls[controlName];
        if (control.dirty && control.value.trim() !== '') {
          return false;
        }
      }
    }

    if (
      JSON.stringify(this.stateService.manualAccountCreation.employerDetails) !==
      JSON.stringify(this.employerDetailsForm.value)
    ) {
      return false;
    }

    return true;
  }

  /**
   * Sets up the employer details form with the necessary form controls.
   */
  private setupEmployerDetailsForm(): void {
    this.employerDetailsForm = new FormGroup({
      employerName: new FormControl(null, [Validators.required, Validators.maxLength(35)]),
      employeeReference: new FormControl(null, [Validators.required, Validators.maxLength(20)]),
      employerEmailAddress: new FormControl(null, [optionalMaxLengthValidator(76), optionalEmailAddressValidator()]),
      employerTelephone: new FormControl(null, [optionalMaxLengthValidator(13), optionalPhoneNumberValidator()]),
      employerAddress1: new FormControl(null, [
        Validators.required,
        Validators.maxLength(30),
        specialCharactersValidator(),
      ]),
      employerAddress2: new FormControl(null, [optionalMaxLengthValidator(30), specialCharactersValidator()]),
      employerAddress3: new FormControl(null, [optionalMaxLengthValidator(30), specialCharactersValidator()]),
      employerAddress4: new FormControl(null, [optionalMaxLengthValidator(30), specialCharactersValidator()]),
      employerAddress5: new FormControl(null, [optionalMaxLengthValidator(30), specialCharactersValidator()]),
      employerPostcode: new FormControl(null, [optionalMaxLengthValidator(8)]),
    });
  }

  /**
   * Handles the form submission for employer details.
   * @param formData - The form data containing the search parameters.
   */
  public handleEmployerDetailsSubmit(formData: IManualAccountCreationEmployerDetailsState): void {
    this.stateService.manualAccountCreation = {
      employerDetails: formData,
    };

    this.router.navigate([ManualAccountCreationRoutes.createAccount]);
  }

  public ngOnInit(): void {
    this.setupEmployerDetailsForm();
  }
}
