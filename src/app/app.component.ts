import { Component, OnInit, inject } from '@angular/core';
import { SessionService, StateService } from '@services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  private readonly stateService = inject(StateService);
  private readonly sessionService = inject(SessionService);

  /**
   * Refreshes the user state cache by redirecting the window to the root URL.
   * This triggers the entire application to reload, and the server to update the cache.
   */
  private refreshUserStateCache(): void {
    window.location.href = '/';
  }

  /**
   * Validates the user state cache by comparing the cache in the browser with the cache in the server.
   * If the caches do not match, the page is reloaded. This can be caused by the user navigating back to cached pages in the browser history
   */
  private validateUserStateCache(): void {
    // If the cache in the browser, does not match the cache in the server, then reload the page.
    // We do not need to unsubscribe from this subscription - https://stackoverflow.com/a/35043309
    this.sessionService.getUserState().subscribe((userState) => {
      const userStateIsDifferent = JSON.stringify(userState) !== JSON.stringify(this.stateService.userState);
      if (userStateIsDifferent) {
        // Force browser to reload the page, and update the cache.
        this.refreshUserStateCache();
      }
    });
  }

  ngOnInit(): void {
    // Only validate if we are authenticated
    if (this.stateService.authenticated()) {
      this.validateUserStateCache();
    }
  }
}
