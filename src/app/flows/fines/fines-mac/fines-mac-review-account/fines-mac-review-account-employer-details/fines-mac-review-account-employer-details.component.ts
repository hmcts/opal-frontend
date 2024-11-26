import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from '@angular/core';
import { GovukSummaryCardListComponent } from '@components/govuk/govuk-summary-card-list/govuk-summary-card-list.component';
import { GovukSummaryListRowComponent } from '@components/govuk/govuk-summary-list/govuk-summary-list-row/govuk-summary-list-row.component';
import { GovukSummaryListComponent } from '@components/govuk/govuk-summary-list/govuk-summary-list.component';
import { IFinesMacEmployerDetailsState } from '../../fines-mac-employer-details/interfaces/fines-mac-employer-details-state.interface';
import { FinesMacReviewAccountDefaultValues } from '../enums/fines-mac-review-account-default-values.enum';
import { UtilsService } from '@services/utils/utils.service';

@Component({
  selector: 'app-fines-mac-review-account-employer-details',
  standalone: true,
  imports: [GovukSummaryCardListComponent, GovukSummaryListComponent, GovukSummaryListRowComponent],
  templateUrl: './fines-mac-review-account-employer-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacReviewAccountEmployerDetailsComponent implements OnInit {
  @Input({ required: true }) public employerDetails!: IFinesMacEmployerDetailsState;

  private utilsService = inject(UtilsService);

  public defaultValues = FinesMacReviewAccountDefaultValues;
  public employerAddress!: string | null;

  private getEmployerAddressData(): void {
    const {
      fm_employer_details_employer_address_line_1,
      fm_employer_details_employer_address_line_2,
      fm_employer_details_employer_address_line_3,
      fm_employer_details_employer_address_line_4,
      fm_employer_details_employer_address_line_5,
      fm_employer_details_employer_post_code,
    } = this.employerDetails;

    this.employerAddress = this.utilsService.formatAddress(
      [
        fm_employer_details_employer_address_line_1,
        fm_employer_details_employer_address_line_2,
        fm_employer_details_employer_address_line_3,
        fm_employer_details_employer_address_line_4,
        fm_employer_details_employer_address_line_5,
        fm_employer_details_employer_post_code,
      ],
      '<br>',
    );
  }

  private getEmployerDetailsData(): void {
    this.getEmployerAddressData();
  }

  public ngOnInit(): void {
    this.getEmployerDetailsData();
  }
}
