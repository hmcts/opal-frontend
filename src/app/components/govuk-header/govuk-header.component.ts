import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-govuk-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './govuk-header.component.html',
  styleUrl: './govuk-header.component.scss',
})
export class GovukHeaderComponent {
  @Input() serviceName = '';
  @Input() serviceLink = '';
  @Input() headerLink = '';
}
