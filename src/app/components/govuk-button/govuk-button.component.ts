import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

enum ButtonStyles {
  default = '',
  secondary = 'govuk-button--secondary',
  warning = 'govuk-button--warning',
  inverse = 'govuk-button--inverse',
  start = 'govuk-button--start',
}

@Component({
  selector: 'app-govuk-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './govuk-button.component.html',
  styleUrls: ['./govuk-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukButtonComponent {
  @Input({ required: true }) id!: string;
  @Input() type = 'button';
  @Input() buttonStyle: 'default' | 'secondary' | 'warning' | 'inverse' | 'start' = 'default';

  public getButtonStyle(): string {
    return `govuk-button ${ButtonStyles[this.buttonStyle]} govuk-!-margin-bottom-0`;
  }
}
