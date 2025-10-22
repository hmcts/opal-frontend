import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MojTicketPanelComponent } from '@hmcts/opal-frontend-common/components/moj/moj-ticket-panel';
import { IOpalFinesOffencesRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-offences-ref-data.interface';

@Component({
  selector: 'app-fines-mac-offence-code-hint',
  imports: [NgTemplateOutlet, MojTicketPanelComponent],
  templateUrl: './fines-mac-offence-code-hint.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacOffenceCodeHintComponent {
  @Input() public offenceCode!: IOpalFinesOffencesRefData;
  @Input() public selectedOffenceConfirmation!: boolean;
}
