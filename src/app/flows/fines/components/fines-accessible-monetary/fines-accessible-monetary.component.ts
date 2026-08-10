import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { MonetaryPipe } from '@hmcts/opal-frontend-common/pipes/monetary';

type MonetaryFormat = 'default' | 'remove-minus-symbol';

@Component({
  selector: 'app-fines-accessible-monetary',
  imports: [],
  providers: [MonetaryPipe],
  template: `
    @if (hasAccessibleNegativeValue) {
      <span aria-hidden="true">{{ formattedValue }}</span>
      <span class="govuk-visually-hidden">{{ accessibleValue }}</span>
    } @else {
      {{ formattedValue }}
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccessibleMonetaryComponent {
  private readonly monetaryPipe = inject(MonetaryPipe);

  @Input({ required: true }) public value: number | string | null | undefined;
  @Input() public format: MonetaryFormat = 'default';

  public get formattedValue(): string {
    if (this.value === null || this.value === undefined || this.value === '') {
      return '';
    }

    if (typeof this.value === 'string' && this.value.includes('£')) {
      if (this.format === 'remove-minus-symbol' && this.value.startsWith('-')) {
        return this.value.slice(1);
      }

      return this.value;
    }

    return this.monetaryPipe.transform(this.value, this.format);
  }

  public get hasAccessibleNegativeValue(): boolean {
    return this.formattedValue.startsWith('-');
  }

  public get accessibleValue(): string {
    if (!this.hasAccessibleNegativeValue) {
      return this.formattedValue;
    }

    return `minus ${this.formattedValue.slice(1)}`;
  }
}
