import { Component, EventEmitter, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RoutingPaths } from '@enums';
import { CanDeactivateType } from '@interfaces';
import { StateService } from '@services';

@Component({
  standalone: true,
  template: '',
})
export abstract class FormParentBaseComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private overrideExitPage = false;
  public stateService = inject(StateService);
  public unsavedChanges!: boolean;
  deactivateResult = new EventEmitter<boolean>();

  /**
   * If the user navigates externally from the site or closes the tab
   * Check if there is unsaved changes form state -> warning message
   * Otherwise -> no warning message
   *
   * @returns boolean
   */
  canDeactivate(): CanDeactivateType {
    if (this.unsavedChanges && !this.overrideExitPage) {
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
        this.overrideExitPage = true;
        this.router.navigate([RoutingPaths.exitPage], { relativeTo: this.activatedRoute.parent });
      }
    });
  }

  ngOnDestroy() {
    this.deactivateResult.unsubscribe();
  }
}
