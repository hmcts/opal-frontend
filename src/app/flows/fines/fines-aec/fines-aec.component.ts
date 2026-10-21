import { Component, ChangeDetectionStrategy, HostListener, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { activeRoutedFormHasUnsavedChanges } from '../utils/active-routed-form-unsaved.utils';

@Component({
  selector: 'app-fines-aec',
  imports: [RouterOutlet],
  templateUrl: './fines-aec.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAecComponent {
  @ViewChild(RouterOutlet) private routerOutlet?: RouterOutlet;

  @HostListener('window:beforeunload')
  public handleBeforeUnload(): boolean {
    return !activeRoutedFormHasUnsavedChanges(this.routerOutlet);
  }
}
