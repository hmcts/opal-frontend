import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
@Component({
  selector: 'app-govuk-accordion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './govuk-accordion.component.html',
  styleUrls: ['./govuk-accordion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukAccordionComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);

  public ngOnInit(): void {
    // This is to load the govuk lib in dev mode.
    // There is a polyfill in the server.ts to handle missing windo objects.
    if (isPlatformBrowser(this.platformId)) {
      import('govuk-frontend').then((govuk) => {
        govuk.initAll();
      });
    }
  }
}
