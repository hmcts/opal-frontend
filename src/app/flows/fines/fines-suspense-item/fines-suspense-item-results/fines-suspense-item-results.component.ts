import { FinesSuspenseItemResultsFoundComponent } from './fines-suspense-item-results-found/fines-suspense-item-results-found.component';
import { IOpalFinesSuspenseItemSummary } from '@services/fines/opal-fines-service/interfaces/opal-fines-suspense-item-summary.interface';
import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnDestroy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractFormParentBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-parent-base';
import { FinesSuspenseItemStore } from '../stores/fines-suspense-item.store';
import { FinesSuspenseItemResultsSearchFormComponent } from './fines-suspense-item-results-search-form/fines-suspense-item-results-search-form.component';
import { GovukBackLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-back-link';
import { FINES_ROUTING_PATHS } from '@app/flows/fines/routing/constants/fines-routing-paths.constant';
import { FINES_SUSPENSE_ITEM_ROUTING_PATHS } from '../routing/constants/fines-suspense-item-routing-paths.constant';
import { IAbstractFormBaseForm } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { IFinesSuspenseItemResultsSearchFormState } from './fines-suspense-item-results-search-form/interfaces/fines-suspense-item-results-search-form-state.interface';

import { navigateToSuspenseItemResults } from '../utils/fines-suspense-item-navigate-to-results.utils';

@Component({
  selector: 'app-fines-suspense-item-results',
  imports: [
    GovukBackLinkComponent,
    FinesSuspenseItemResultsSearchFormComponent,
    FinesSuspenseItemResultsFoundComponent,
  ],
  templateUrl: './fines-suspense-item-results.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesSuspenseItemResultsComponent extends AbstractFormParentBaseComponent implements OnDestroy {
  private readonly destroyRef = inject(DestroyRef);
  private readonly navigationRouter = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly suspenseItemStore = inject(FinesSuspenseItemStore);
  private readonly routeParameters = toSignal(this.route.paramMap, { initialValue: this.route.snapshot.paramMap });

  private readonly routeData = toSignal(this.route.data, { initialValue: this.route.snapshot.data });

  public readonly summary = computed(() => this.routeData()['summary'] as IOpalFinesSuspenseItemSummary | null);
  public readonly businessUnitName = computed(() => this.suspenseItemStore.selectedBusinessUnitName() ?? '');
  public readonly initialReference = computed(() => this.routeParameters().get('suspenseItemId') ?? '');
  public override stateUnsavedChanges = false;

  public handleFormSubmit(form: IAbstractFormBaseForm<IFinesSuspenseItemResultsSearchFormState>): void {
    const reference = form.formData.fsir_suspense_reference_number;
    navigateToSuspenseItemResults(this.navigationRouter, reference, () => {
      if (!this.destroyRef.destroyed) {
        this.handleUnsavedChanges(true);
      }
    });
  }

  public handleUnsavedChanges(unsavedChanges: boolean): void {
    this.stateUnsavedChanges = unsavedChanges;
    this.suspenseItemStore.setUnsavedChanges(unsavedChanges);
  }

  public ngOnDestroy(): void {
    this.suspenseItemStore.setUnsavedChanges(false);
  }

  public navigateBackToSearch(): void {
    void this.navigationRouter.navigate([
      '/',
      FINES_ROUTING_PATHS.root,
      FINES_SUSPENSE_ITEM_ROUTING_PATHS.root,
      FINES_SUSPENSE_ITEM_ROUTING_PATHS.children.search,
    ]);
  }
}
