import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, Input, PLATFORM_ID, inject } from '@angular/core';

@Component({
  selector: 'app-govuk-tabs',

  imports: [],
  templateUrl: './govuk-tabs.component.html',

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukTabsComponent implements AfterViewInit {
  private readonly platformId = inject(PLATFORM_ID);

  @Input({ required: true }) public tabsId!: string;
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
