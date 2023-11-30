import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-govuk-text-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './govuk-text-input.component.html',
  styleUrl: './govuk-text-input.component.scss',
})
export class GovukTextInputComponent {
  @Input({ required: true }) labelText!: string;
  @Input({ required: true }) labelFor!: string;
  @Input({ required: true }) inputId!: string;
  @Input({ required: true }) inputName!: string;
}
