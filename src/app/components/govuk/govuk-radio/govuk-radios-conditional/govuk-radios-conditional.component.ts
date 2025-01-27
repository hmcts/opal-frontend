import { ChangeDetectionStrategy, Component, HostBinding, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-govuk-radios-conditional, [app-govuk-radios-conditional]',

  imports: [],
  templateUrl: './govuk-radios-conditional.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukRadiosConditionalComponent implements OnInit {
  @Input({ required: true }) conditionalId!: string;

  @HostBinding('class') class = 'govuk-radios__conditional';
  @HostBinding('id') id!: string;

  ngOnInit() {
    this.id = `${this.conditionalId}-conditional`;
  }
}
