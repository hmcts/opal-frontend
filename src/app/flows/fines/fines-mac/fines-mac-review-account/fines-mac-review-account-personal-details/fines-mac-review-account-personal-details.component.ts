import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from '@angular/core';
import { GovukSummaryCardListComponent } from '@components/govuk/govuk-summary-card-list/govuk-summary-card-list.component';
import { GovukSummaryListRowComponent } from '@components/govuk/govuk-summary-list/govuk-summary-list-row/govuk-summary-list-row.component';
import { GovukSummaryListComponent } from '@components/govuk/govuk-summary-list/govuk-summary-list.component';
import { IFinesMacPersonalDetailsState } from '../../fines-mac-personal-details/interfaces/fines-mac-personal-details-state.interface';
import { FinesMacReviewAccountDefaultValues } from '../enums/fines-mac-review-account-default-values.enum';
import { IFinesMacPersonalDetailsAliasState } from '../../fines-mac-personal-details/interfaces/fines-mac-personal-details-alias-state.interface';
import { DateService } from '@services/date-service/date.service';
import { UtilsService } from '@services/utils/utils.service';

@Component({
  selector: 'app-fines-mac-review-account-personal-details',
  standalone: true,
  imports: [GovukSummaryCardListComponent, GovukSummaryListComponent, GovukSummaryListRowComponent],
  templateUrl: './fines-mac-review-account-personal-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacReviewAccountPersonalDetailsComponent implements OnInit {
  @Input({ required: true }) public personalDetails!: IFinesMacPersonalDetailsState;

  private dateService = inject(DateService);
  private utilsService = inject(UtilsService);

  public defaultValues = FinesMacReviewAccountDefaultValues;
  public aliases!: string;
  public dob!: string | null;
  public address!: string;

  private getAliasesData(): void {
    this.aliases = this.personalDetails.fm_personal_details_aliases
      .map((item) => {
        const forenameKey = Object.keys(item).find((key) =>
          key.includes('forenames'),
        ) as keyof IFinesMacPersonalDetailsAliasState;
        const surnameKey = Object.keys(item).find((key) =>
          key.includes('surname'),
        ) as keyof IFinesMacPersonalDetailsAliasState;

        return `${item[forenameKey]} ${item[surnameKey]}`.trim();
      })
      .join('<br>');
  }

  private getDateOfBirthData(): void {
    if (this.personalDetails.fm_personal_details_dob) {
      const dob = this.dateService.getFromFormat(this.personalDetails.fm_personal_details_dob, 'dd/MM/yyyy');
      const age = this.dateService.calculateAge(dob);
      this.dob = `${dob.toFormat('dd MMMM yyyy')} (${age >= 18 ? 'Adult' : 'Youth'})`;
    }
  }

  private getAddressData(): void {
    const {
      fm_personal_details_address_line_1,
      fm_personal_details_address_line_2,
      fm_personal_details_address_line_3,
      fm_personal_details_post_code,
    } = this.personalDetails;

    this.address = this.utilsService.formatAddress(
      [
        fm_personal_details_address_line_1,
        fm_personal_details_address_line_2,
        fm_personal_details_address_line_3,
        fm_personal_details_post_code,
      ],
      '<br>',
    );
  }

  private getPersonalDetailsData(): void {
    this.getAliasesData();
    this.getDateOfBirthData();
    this.getAddressData();
  }

  public ngOnInit(): void {
    this.getPersonalDetailsData();
  }
}
