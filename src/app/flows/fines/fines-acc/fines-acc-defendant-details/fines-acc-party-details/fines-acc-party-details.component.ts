import { Component, Input } from '@angular/core';
import { FinesNotProvidedComponent } from '../../../components/fines-not-provided/fines-not-provided.component';
import { NgTemplateOutlet, UpperCasePipe } from '@angular/common';
import { GovukSummaryCardListComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-summary-card-list';
import {
  GovukSummaryListComponent,
  GovukSummaryListRowComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-summary-list';
import { IOpalFinesAccountPartyDetails } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-account-party.interface';
import { FINES_MAC_LANGUAGE_PREFERENCES_OPTIONS } from '../../../fines-mac/fines-mac-language-preferences/constants/fines-mac-language-preferences-options';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';

@Component({
  selector: 'app-fines-acc-party-details',
  templateUrl: './fines-acc-party-details.component.html',
  imports: [
    FinesNotProvidedComponent,
    UpperCasePipe,
    GovukSummaryCardListComponent,
    GovukSummaryListComponent,
    GovukSummaryListRowComponent,
    NgTemplateOutlet,
  ],
})
export class FinesAccPartyDetails {
  @Input({ required: true }) party!: IOpalFinesAccountPartyDetails;
  @Input({ required: true }) cardTitle!: string;
  @Input({ required: true }) summaryCardListId!: string;
  @Input({ required: true }) summaryListId!: string;
  public readonly languages = FINES_MAC_LANGUAGE_PREFERENCES_OPTIONS;
  public readonly dateService = new DateService();
  public readonly utilsService = new UtilsService();
}
