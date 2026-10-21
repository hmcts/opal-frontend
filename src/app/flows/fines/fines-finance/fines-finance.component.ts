import { ChangeDetectionStrategy, Component, HostListener, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { activeRoutedFormHasUnsavedChanges } from '../utils/active-routed-form-unsaved.utils';

@Component({
  selector: 'app-fines-finance',
  imports: [RouterOutlet],
  templateUrl: './fines-finance.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesFinanceComponent {
  @ViewChild(RouterOutlet) private routerOutlet?: RouterOutlet;

  @HostListener('window:beforeunload')
  public handleBeforeUnload(): boolean {
    return !activeRoutedFormHasUnsavedChanges(this.routerOutlet);
  }
}
