import { AfterViewInit, ChangeDetectionStrategy, Component, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
@Component({
  selector: 'app-govuk-accordion',

  imports: [CommonModule],
  templateUrl: './govuk-accordion.component.html',

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukAccordionComponent implements AfterViewInit {
  private readonly platformId = inject(PLATFORM_ID);

  /**
   * Lifecycle hook that is called after Angular has fully initialized the component's view.
   * It is called only once after the first ngAfterContentChecked.
   * We use it to initialize the govuk-frontend component.
   */
  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      import('govuk-frontend').then((govuk) => {
        govuk.initAll();
      });
    }
  }
}
