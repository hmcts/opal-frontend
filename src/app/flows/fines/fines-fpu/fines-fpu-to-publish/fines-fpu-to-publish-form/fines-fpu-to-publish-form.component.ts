import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AbstractFormBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base';
import { FinesFpuToPublishTableWrapperComponent } from './fines-fpu-to-publish-table-wrapper/fines-fpu-to-publish-table-wrapper.component';
import { IFinesFpuBusinessUnit } from '../../interfaces/fines-fpu-business-unit.interface';

@Component({
  selector: 'app-fines-fpu-to-publish-form',
  imports: [ReactiveFormsModule, FinesFpuToPublishTableWrapperComponent],
  templateUrl: './fines-fpu-to-publish-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesFpuToPublishFormComponent extends AbstractFormBaseComponent implements OnInit, OnChanges, OnDestroy {
  @Input() public businessUnits: readonly IFinesFpuBusinessUnit[] = [];
  @Input() public selectedBusinessUnitIds: readonly number[] = [];
  @Output() public readonly selectionChanged = new EventEmitter<number[]>();

  public override form = new FormGroup({
    selectedBusinessUnitIds: new FormControl<number[]>([], { nonNullable: true }),
  });

  /**
   * Records checkbox interaction in the form and passes the selection to its parent.
   *
   * @param selectedBusinessUnitIds - The table's updated business unit selection.
   */
  protected handleSelectionChanged(selectedBusinessUnitIds: number[]): void {
    const selectedIds = [...selectedBusinessUnitIds];
    this.form.controls.selectedBusinessUnitIds.markAsDirty();
    this.form.controls.selectedBusinessUnitIds.setValue(selectedIds);
    this.selectionChanged.emit(selectedIds);
  }

  /**
   * Restores parent selections without treating refreshed data as user input.
   *
   * @param changes - Input changes supplied by Angular.
   */
  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedBusinessUnitIds']) {
      this.form.patchValue({ selectedBusinessUnitIds: [...this.selectedBusinessUnitIds] }, { emitEvent: false });
    }
  }

  /** Starts the inherited form value listener after initial selections have been restored. */
  public override ngOnInit(): void {
    super.ngOnInit();
  }

  /** Disposes the inherited form subscriptions when the tab content is removed. */
  public override ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
