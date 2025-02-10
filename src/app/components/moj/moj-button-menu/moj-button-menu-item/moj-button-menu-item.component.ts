import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-moj-button-menu-item',
  imports: [],
  templateUrl: './moj-button-menu-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MojButtonMenuItemComponent {
  @Output() actionClick = new EventEmitter<boolean>();

  public handleClick(event: Event) {
    event.preventDefault();
    this.actionClick.emit(true);
  }
}
