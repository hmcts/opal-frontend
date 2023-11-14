import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GovukHeader } from '@enums';
@Component({
  selector: 'app-govuk-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './govuk-header.component.html',
  styleUrl: './govuk-header.component.scss',
})
export class GovukHeaderComponent {
  public readonly header = GovukHeader;
}
