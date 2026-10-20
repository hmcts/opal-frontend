import { ChangeDetectionStrategy, Component, HostListener, inject, OnDestroy, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AbstractFormParentBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-parent-base';
import { FinesConStore } from './stores/fines-con.store';

@Component({
  selector: 'app-fines-consolidation',
  imports: [RouterOutlet],
  templateUrl: './fines-con.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesConComponent implements OnDestroy {
  @ViewChild(RouterOutlet) private routerOutlet?: RouterOutlet;

  private readonly finesConStore = inject(FinesConStore);

  @HostListener('window:beforeunload')
  public handleBeforeUnload(): boolean {
    const activePage = this.routerOutlet?.isActivated ? this.routerOutlet.component : null;
    const activeFormHasUnsavedChanges =
      activePage instanceof AbstractFormParentBaseComponent && activePage.stateUnsavedChanges;

    return !(activeFormHasUnsavedChanges || this.finesConStore.unsavedChanges() || this.finesConStore.stateChanges());
  }

  public ngOnDestroy(): void {
    this.finesConStore.resetConsolidationState();
  }
}
