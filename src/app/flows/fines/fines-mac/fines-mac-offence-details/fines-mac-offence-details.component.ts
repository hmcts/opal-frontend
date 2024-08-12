import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GovukButtonComponent, GovukCancelLinkComponent } from '@components/govuk';
import { FinesMacRoutes } from '@enums/fines/mac';
import { FinesService } from '@services/fines';

@Component({
  selector: 'app-fines-mac-offence-details',
  standalone: true,
  imports: [GovukButtonComponent, GovukCancelLinkComponent],
  templateUrl: './fines-mac-offence-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacOffenceDetailsComponent {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  protected readonly finesService = inject(FinesService);

  protected readonly finesMacRoutes = FinesMacRoutes;

  /**
   * Navigates to the specified route.
   *
   * @param route - The route to navigate to.
   */
  public handleRoute(route: string): void {
    this.router.navigate([route], { relativeTo: this.activatedRoute.parent });
  }
}
