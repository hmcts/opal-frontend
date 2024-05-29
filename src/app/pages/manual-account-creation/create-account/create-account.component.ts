import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {
  GovukButtonComponent,
  GovukTagComponent,
  GovukTaskListComponent,
  GovukTaskListItemComponent,
} from '@components';
import { ManualAccountCreationRoutes, RoutingPaths } from '@enums';
import { StateService } from '@services';

@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    GovukTagComponent,
    GovukTaskListComponent,
    GovukTaskListItemComponent,
    GovukButtonComponent,
  ],
  templateUrl: './create-account.component.html',
})
export class CreateAccountComponent {
  private readonly router = inject(Router);
  private readonly stateService = inject(StateService);
  public readonly routingPaths = RoutingPaths;
  public readonly manualAccountCreationRoutes = ManualAccountCreationRoutes;

  /**
   * Handles route with the supplied route
   *
   * @param route string of route
   */
  public handleRoute(route: string): void {
    this.router.navigate([route]);
  }
}
