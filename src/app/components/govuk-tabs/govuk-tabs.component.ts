import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, PLATFORM_ID, inject } from '@angular/core';

@Component({
  selector: 'app-govuk-tabs',
  standalone: true,
  imports: [],
  templateUrl: './govuk-tabs.component.html',
  styleUrl: './govuk-tabs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukTabsComponent implements AfterViewInit {
  private platformId = inject(PLATFORM_ID);

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
