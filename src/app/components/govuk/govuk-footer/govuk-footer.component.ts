import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GOVUK_FOOTER_LINKS } from './constants/govuk-footer-links.constant';

@Component({
  selector: 'app-govuk-footer',
  imports: [CommonModule],
  templateUrl: './govuk-footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukFooterComponent {
  public readonly footer = GOVUK_FOOTER_LINKS;
}
