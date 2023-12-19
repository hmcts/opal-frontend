import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, PLATFORM_ID, inject } from '@angular/core';

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

  // public ngOnInit(): void {
  //   // This is to load the govuk lib in dev mode.
  //   // There is a polyfill in the server.ts to handle missing windo objects.
  //   if (isPlatformBrowser(this.platformId)) {
  //     import('govuk-frontend').then((govuk) => {
  //       govuk.initAll();
  //     });
  //   }
  // }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      import('govuk-frontend').then((govuk) => {
        console.log('govuk', govuk);
        govuk.initAll();
      });
    }
  }
}
