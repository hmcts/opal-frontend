import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GovukButtonComponent, GovukTextInputComponent } from '@components';

@Component({
  selector: 'app-sign-in-stub',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, GovukTextInputComponent, GovukButtonComponent],
  templateUrl: './sign-in-stub.component.html',
  styleUrl: './sign-in-stub.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInStubComponent implements OnInit {
  private readonly document = inject(DOCUMENT);
  public signInForm!: FormGroup;

  private setupSignInForm(): void {
    this.signInForm = new FormGroup({
      username: new FormControl(null),
    });
  }

  public handleFormSubmit(): void {
    this.document.location.href = `/sso/login?username=${this.signInForm.value.username}`;
  }

  public ngOnInit(): void {
    this.setupSignInForm();
  }
}
