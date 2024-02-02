import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-govuk-inset-text',
  standalone: true,
  imports: [],
  templateUrl: './govuk-inset-text.component.html',
  styleUrl: './govuk-inset-text.component.scss',
})
export class GovukInsetTextComponent {
  @Input({ required: true }) insetTextId!: string;
}
