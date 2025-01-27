import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-moj-button-menu',

  imports: [],
  templateUrl: './moj-button-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MojButtonMenuComponent {
  @Input({ required: true }) menuButtonTitle!: string;

  /**
   * Toggles the button menu by changing the `aria-expanded` attribute of the toggle button.
   */
  public toggleButtonMenu() {
    const button = document.querySelector('.moj-button-menu__toggle-button')!;
    const isExpanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!isExpanded));
  }
}
