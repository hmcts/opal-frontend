import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GovukHeaderLinks } from './enums';
@Component({
  selector: 'app-govuk-header',
  imports: [CommonModule, RouterLink],
  templateUrl: './govuk-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukHeaderComponent {
  public readonly headerLinks = GovukHeaderLinks;
}
