import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  inject,
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MojTicketPanelComponent } from '@hmcts/opal-frontend-common/components/moj/moj-ticket-panel';
import { GovukDetailsComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-details';
import { GovukTextInputComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-text-input';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-fines-mac-default-days',
  imports: [GovukDetailsComponent, GovukTextInputComponent, MojTicketPanelComponent],
  templateUrl: './fines-mac-default-days.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacDefaultDaysComponent implements OnInit, OnDestroy, OnChanges {
  private readonly dateService = inject(DateService);
  private readonly ngUnsubscribe = new Subject<void>();

  @Input({ required: true }) date!: string;

  public daysInDefaultCalculatorForm = new FormGroup({
    years: new FormControl<number | null>(null),
    months: new FormControl<number | null>(null),
    weeks: new FormControl<number | null>(null),
    days: new FormControl<number | null>(null),
  });
  public daysInDefaultCalculated!: number;

  /**
   * Calculates the number of days in default based on the selected date and duration values.
   * If the selected date is valid, it adds the specified duration to the date and calculates the difference in days.
   */
  public calculateDaysInDefault(): void {
    if (this.dateService.isValidDate(this.date)) {
      const { years, months, weeks, days } = this.daysInDefaultCalculatorForm.value;
      const newDate = this.dateService.addDurationToDate(
        this.date,
        Number(years),
        Number(months),
        Number(weeks),
        Number(days),
      );
      this.daysInDefaultCalculated = this.dateService.calculateDaysBetweenDates(this.date, newDate);
    }
  }

  /**
   * Lifecycle hook that is called when one or more data-bound input properties of the component change.
   *
   * @param changes - An object containing the changed properties and their current and previous values.
   * @returns void
   */
  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['date'] && !changes['date'].isFirstChange()) {
      this.calculateDaysInDefault();
    }
  }

  public ngOnInit(): void {
    this.daysInDefaultCalculatorForm.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.calculateDaysInDefault());
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
