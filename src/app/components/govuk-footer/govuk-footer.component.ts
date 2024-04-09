import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GovukFooter } from '@enums';

@Component({
  selector: 'app-govuk-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './govuk-footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukFooterComponent {
  public readonly footer = GovukFooter;
}
