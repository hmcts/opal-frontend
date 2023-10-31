import { ChangeDetectionStrategy, Component, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

enum ButtonStyles {
  default,
  secondary,
  warning,
  inverse,
  start,
}

enum ButtonClasses {
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
export class GovukButtonComponent implements OnInit {
  @Input({ required: true }) id!: string;
  @Input() type = 'button';
  @Input() buttonStyle: keyof typeof ButtonStyles = 'default';

  public buttonClass = signal('govuk-button');

  private setButtonClass(): void {
    this.buttonClass.update(
      (buttonClass) => `${buttonClass} ${ButtonClasses[this.buttonStyle]} govuk-!-margin-bottom-0`
    );
    console.log('After', this.buttonClass());
  }

  public ngOnInit(): void {
    this.setButtonClass();
  }
}
