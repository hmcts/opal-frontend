import { ChangeDetectionStrategy, Component, HostListener, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CanDeactivateTypes } from '@hmcts/opal-frontend-common/guards/can-deactivate/types';
import { FinesApiStore } from './stores/fines-api.store';

@Component({
  selector: 'app-fines-api',
  imports: [RouterOutlet],
  templateUrl: './fines-api.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesApiComponent {
  private readonly finesApiStore = inject(FinesApiStore);

  @HostListener('window:beforeunload')
  handleBeforeUnload(): boolean {
    return !this.finesApiStore.unsavedChanges();
  }

  public canDeactivate(): CanDeactivateTypes {
    return !this.finesApiStore.unsavedChanges();
  }
}
