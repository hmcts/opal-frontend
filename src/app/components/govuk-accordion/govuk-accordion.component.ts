import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { initAll } from 'govuk-frontend';

@Component({
  selector: 'app-govuk-accordion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './govuk-accordion.component.html',
  styleUrls: ['./govuk-accordion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukAccordionComponent implements OnInit {
  public ngOnInit(): void {
    initAll();
  }
}
