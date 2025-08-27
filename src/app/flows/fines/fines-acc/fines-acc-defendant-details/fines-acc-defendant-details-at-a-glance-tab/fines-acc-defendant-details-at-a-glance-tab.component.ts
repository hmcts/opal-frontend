import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { IOpalFinesAccountDetailsAtAGlanceTabRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-details-at-a-glance-tab-ref-data.interface';
import { UpperCasePipe } from '@angular/common';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { GovukTagComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-tag';
import { MojBadgeComponent } from '@hmcts/opal-frontend-common/components/moj/moj-badge';
import { FINES_MAC_LANGUAGE_PREFERENCES_OPTIONS } from '../../../fines-mac/fines-mac-language-preferences/constants/fines-mac-language-preferences-options';

@Component({
  selector: 'app-fines-acc-defendant-details-at-a-glance-tab',
  imports: [UpperCasePipe, GovukTagComponent, MojBadgeComponent],
  templateUrl: './fines-acc-defendant-details-at-a-glance-tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccDefendantDetailsAtAGlanceTabComponent {
  @Input() tabData!: IOpalFinesAccountDetailsAtAGlanceTabRefData | null;
  @Input() hasAccountMaintenencePermission: boolean = false;
  @Input() isYouth: boolean | null = false;
  @Input() style: {
    heading: string;
    hr: string;
    key: string;
    value: string;
  } = {
    heading: '',
    hr: '',
    key: '',
    value: '',
  };
  @Output() addComments = new EventEmitter<Event>();
  public readonly dateService = new DateService();
  public readonly utilsService = new UtilsService();
  public readonly languages = FINES_MAC_LANGUAGE_PREFERENCES_OPTIONS;
}
