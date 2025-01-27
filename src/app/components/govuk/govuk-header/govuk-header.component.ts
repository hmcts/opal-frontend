import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GlobalStateService } from '@services/global-state-service/global-state.service';
import { GOVUK_HEADER_LINKS } from './constants/govuk-header-links.constant';
@Component({
  selector: 'app-govuk-header',

  imports: [CommonModule, RouterLink],
  templateUrl: './govuk-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukHeaderComponent {
  public readonly headerLinks = GOVUK_HEADER_LINKS;
  public readonly globalStateService = inject(GlobalStateService);
}
