import { Component, EventEmitter, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ManualAccountCreationRoutes, RoutingPaths } from '@enums';
import { CanDeactivateType } from '@interfaces';
import { StateService } from '@services';

@Component({
  standalone: true,
  template: '',
})
export abstract class FormParentBaseComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  public stateService = inject(StateService);
  public stateUnsavedChanges!: boolean;
  deactivateResult = new EventEmitter<boolean>();

  /**
   * If the user navigates externally from the site or closes the tab
   * Check if there is unsaved changes form state -> warning message
   * Otherwise -> no warning message
   *
   * @returns boolean
   */
  canDeactivate(): CanDeactivateType {
    if (this.stateUnsavedChanges && !this.stateService.overrideExitPage) {
      return false;
    } else {
      return true;
    }
  }

  protected routerNavigate(route: string): void {
    this.router.navigate([route]);
  }

  ngOnInit() {
    this.deactivateResult.subscribe((result: boolean) => {
      if (!result) {
        this.stateService.overrideExitPage = true;
        this.stateService.currentRoute = this.router.url;
        this.router.navigate([RoutingPaths.exitPage], { relativeTo: this.activatedRoute.parent });
      }
    });
  }

  ngOnDestroy() {
    this.stateService.overrideExitPage = false;
    this.deactivateResult.unsubscribe();
  }
}
