import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { GovukButtonComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-button';
import { GovukTextInputComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-text-input';
import { Router } from '@angular/router';
import { GovukBackLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-back-link';
import { FINES_ROUTING_PATHS } from '@app/flows/fines/routing/constants/fines-routing-paths.constant';
import { FINES_SUSPENSE_ITEM_ROUTING_PATHS } from '../routing/constants/fines-suspense-item-routing-paths.constant';
import { FinesSuspenseItemResultsNotFoundComponent } from './fines-suspense-item-results-not-found/fines-suspense-item-results-not-found.component';

@Component({
  selector: 'app-fines-suspense-item-results',
  imports: [
    GovukBackLinkComponent,
    GovukButtonComponent,
    GovukTextInputComponent,
    FinesSuspenseItemResultsNotFoundComponent,
  ],
  templateUrl: './fines-suspense-item-results.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesSuspenseItemResultsComponent {
  private readonly router = inject(Router);

  public readonly businessUnitName = input('');
  public readonly referenceControl = new FormControl('', { nonNullable: true });

  public navigateBackToSearch(): void {
    void this.router.navigate([
      '/',
      FINES_ROUTING_PATHS.root,
      FINES_SUSPENSE_ITEM_ROUTING_PATHS.root,
      FINES_SUSPENSE_ITEM_ROUTING_PATHS.children.search,
    ]);
  }
}
