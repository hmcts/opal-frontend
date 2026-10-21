import { ChangeDetectionStrategy, Component, HostListener, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { activeRoutedFormHasUnsavedChanges } from '../../utils/active-routed-form-unsaved.utils';

@Component({
  selector: 'app-fines-draft-check-and-validate',
  imports: [RouterOutlet],
  templateUrl: './fines-draft-check-and-validate.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesDraftCheckAndValidateComponent {
  @ViewChild(RouterOutlet) private routerOutlet?: RouterOutlet;

  @HostListener('window:beforeunload')
  public handleBeforeUnload(): boolean {
    return !activeRoutedFormHasUnsavedChanges(this.routerOutlet);
  }
}
