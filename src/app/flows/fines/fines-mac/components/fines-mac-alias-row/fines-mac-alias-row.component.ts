import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-fines-mac-alias-row',
  templateUrl: './fines-mac-alias-row.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacAliasRowComponent {
  @Input({ required: true }) public index!: number;
  @Input({ required: true }) public total!: number;
  @Input({ required: true }) public releaseEnabled!: boolean;

  @Output() public removeAlias = new EventEmitter<number>();

  public onRemove(): void {
    this.removeAlias.emit(this.index);
  }
}
