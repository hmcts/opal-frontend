import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { GovukBackLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-back-link';
import { ActivatedRoute, Router } from '@angular/router';
import { CanDeactivateTypes } from '@hmcts/opal-frontend-common/guards/can-deactivate/types';
import { FinesMacOffenceDetailsSearchOffencesStore } from '../stores/fines-mac-offence-details-search-offences.store';

@Component({
  selector: 'app-fines-mac-offence-details-search-offences-results',
  imports: [GovukBackLinkComponent],
  templateUrl: './fines-mac-offence-details-search-offences-results.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacOffenceDetailsSearchOffencesResultsComponent {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  private readonly finesMacOffenceDetailsSearchOffencesStore = inject(FinesMacOffenceDetailsSearchOffencesStore);

  /**
   * Checks if the component can be deactivated.
   * @returns A boolean indicating whether the component can be deactivated.
   */
  canDeactivate(): CanDeactivateTypes {
    return !this.finesMacOffenceDetailsSearchOffencesStore.unsavedChanges();
  }

  /**
   * Navigates back to the parent route relative to the current activated route.
   * Utilizes Angular's Router to perform the navigation.
   */
  public navigateBack(): void {
    this.router.navigate(['..'], { relativeTo: this.activatedRoute });
  }
}
