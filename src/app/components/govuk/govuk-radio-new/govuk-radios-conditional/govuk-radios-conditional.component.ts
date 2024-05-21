import { Component, HostBinding, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-govuk-radios-conditional, [app-govuk-radios-conditional]',
  standalone: true,
  imports: [],
  templateUrl: './govuk-radios-conditional.component.html',
  styleUrl: './govuk-radios-conditional.component.scss',
})
export class GovukRadiosConditionalComponent implements OnInit {
  @Input({ required: true }) conditionalId!: string;

  @HostBinding('class') class = 'govuk-radios__conditional';
  @HostBinding('id') id!: string;

  ngOnInit() {
    this.id = `${this.conditionalId}-conditional`;
  }
}
