import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { IMojButtonMenuActions } from './interfaces';

@Component({
  selector: 'app-moj-button-menu',
  standalone: true,
  imports: [],
  templateUrl: './moj-button-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MojButtonMenuComponent implements AfterViewInit {
  private platformId = inject(PLATFORM_ID);
  @Input({ required: true }) menuButtonTitle!: string;
  @Input({ required: true }) actions!: IMojButtonMenuActions[];
  @Output() actionClick = new EventEmitter<string>();

  /**
   * Lifecycle hook that is called after Angular has fully initialized the component's view.
   * It is called only once after the first ngAfterContentChecked.
   * We use it to initialize the moj component.
   */
  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      import('@ministryofjustice/frontend/moj/all').then((moj) => {
        moj.initAll();
      });
    }
  }

  /**
   * Toggles the button menu by changing the `aria-expanded` attribute of the toggle button.
   */
  public toggleButtonMenu() {
    const button = document.querySelector('.moj-button-menu__toggle-button')!;
    const isExpanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!isExpanded));
  }

  /**
   * Handles the click event for an action.
   * @param actionId - The ID of the action.
   * @param event - The click event.
   */
  public onActionClick(actionId: string, event: Event) {
    event.preventDefault();
    this.actionClick.emit(actionId);
  }
}
