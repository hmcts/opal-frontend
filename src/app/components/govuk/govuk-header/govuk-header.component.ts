import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GlobalStateService } from '@services';
import { GovukHeaderLinks } from './enums';
@Component({
  selector: 'app-govuk-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './govuk-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukHeaderComponent {
  public readonly headerLinks = GovukHeaderLinks;
  public readonly globalStateService = inject(GlobalStateService);
}
