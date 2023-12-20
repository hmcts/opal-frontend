import { AfterViewInit, ChangeDetectionStrategy, Component, inject } from '@angular/core';
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
export class GovukAccordionComponent implements AfterViewInit {
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
