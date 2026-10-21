import { ChangeDetectionStrategy, Component, HostListener, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { activeRoutedFormHasUnsavedChanges } from '../../utils/active-routed-form-unsaved.utils';

@Component({
  selector: 'app-fines-draft-create-and-manage',
  imports: [RouterOutlet],
  templateUrl: './fines-draft-create-and-manage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesDraftCreateAndManageComponent {
  @ViewChild(RouterOutlet) private readonly routerOutlet?: RouterOutlet;

  @HostListener('window:beforeunload')
  public handleBeforeUnload(): boolean {
    return !activeRoutedFormHasUnsavedChanges(this.routerOutlet);
  }
}
