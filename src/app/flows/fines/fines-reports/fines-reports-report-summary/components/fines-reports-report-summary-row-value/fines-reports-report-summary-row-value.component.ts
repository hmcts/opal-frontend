import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DateFormatPipe } from '@hmcts/opal-frontend-common/pipes/date-format';
import { FinesNotProvidedComponent } from '@app/flows/fines/components/fines-not-provided/fines-not-provided.component';
import { FINES_REPORTS_REPORT_SUMMARY_DATE_CREATED_FORMAT } from '../../constants/fines-reports-report-summary-date-created-format.constant';
import { type IFinesReportsReportSummaryDisplayRow } from '../../interfaces/fines-reports-report-summary-display-row.interface';

@Component({
  selector: 'app-fines-reports-report-summary-row-value',
  standalone: true,
  imports: [DateFormatPipe, DecimalPipe, FinesNotProvidedComponent],
  template: `
    @switch (row().type) {
      @case ('dateTime') {
        <p class="govuk-body">
          {{ stringValue() | dateFormat: dateCreatedFormat.input : dateCreatedFormat.output }}
        </p>
      }
      @case ('notProvided') {
        <app-fines-not-provided></app-fines-not-provided>
      }
      @case ('number') {
        <p class="govuk-body">{{ numberValue() | number }}</p>
      }
      @default {
        <p class="govuk-body">{{ stringValue() }}</p>
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesReportsReportSummaryRowValueComponent {
  public readonly row = input.required<IFinesReportsReportSummaryDisplayRow>();
  public readonly dateCreatedFormat = FINES_REPORTS_REPORT_SUMMARY_DATE_CREATED_FORMAT;
  public readonly numberValue = computed(() => {
    const value = this.row().value;

    return typeof value === 'number' ? value : null;
  });
  public readonly stringValue = computed(() => {
    const value = this.row().value;

    return value === null ? '' : String(value);
  });
}
