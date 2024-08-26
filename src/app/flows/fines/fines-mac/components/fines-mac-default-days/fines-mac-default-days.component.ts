import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import {
  GovukCheckboxesComponent,
  GovukCheckboxesConditionalComponent,
  GovukCheckboxesItemComponent,
  GovukDetailsComponent,
  GovukTextInputComponent,
  GovukTextInputPrefixSuffixComponent,
} from '@components/govuk';
import { MojTicketPanelComponent } from '@components/moj';
import { ScotgovDatePickerComponent } from '@components/scotgov';
import { UtilsService } from '@services';

@Component({
  selector: 'app-fines-mac-default-days',
  standalone: true,
  imports: [
    GovukDetailsComponent,
    GovukTextInputComponent,
    MojTicketPanelComponent,
    ScotgovDatePickerComponent,
    GovukTextInputPrefixSuffixComponent,
    GovukCheckboxesComponent,
    GovukCheckboxesItemComponent,
    GovukCheckboxesConditionalComponent,
  ],
  templateUrl: './fines-mac-default-days.component.html',
  styleUrl: './fines-mac-default-days.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacDefaultDaysComponent implements OnInit {
  private utilsService = inject(UtilsService);
  public form = new FormGroup({
    isDaysInDefault: new FormControl(null),
    imposedDate: new FormControl(null),
    daysInDefault: new FormControl(null),
    years: new FormControl(null),
    months: new FormControl(null),
    weeks: new FormControl(null),
    days: new FormControl(null),
  });

  public imposedDate!: string;
  public daysInDefault!: number;

  protected setInputValue(value: any): void {
    if (this.utilsService.isValidDate(value)) {
      this.form.controls['imposedDate'].patchValue(value);
      this.form.controls['imposedDate'].markAsTouched();
    }
  }

  public calculateDaysInDefault(): void {
    if (this.utilsService.isValidDate(this.form.value.imposedDate ?? '')) {
      const imposedDate = String(this.form.value.imposedDate);
      const newDate = this.utilsService.addDurationToDate(
        imposedDate,
        Number(this.form.value.years),
        Number(this.form.value.months),
        Number(this.form.value.weeks),
        Number(this.form.value.days),
      );
      this.daysInDefault = this.utilsService.calculateDaysBetweenDates(imposedDate, newDate);
    }
  }

  public ngOnInit(): void {
    this.form.valueChanges.subscribe(() => this.calculateDaysInDefault());
  }
}
