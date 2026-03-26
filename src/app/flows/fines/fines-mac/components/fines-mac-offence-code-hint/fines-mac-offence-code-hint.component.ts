import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { MojTicketPanelComponent } from '@hmcts/opal-frontend-common/components/moj/moj-ticket-panel';
import { IOpalFinesOffencesRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-offences-ref-data.interface';
import { FinesMacOffenceDetailsService } from '../../fines-mac-offence-details/services/fines-mac-offence-details.service';

@Component({
  selector: 'app-fines-mac-offence-code-hint',
  imports: [NgTemplateOutlet, MojTicketPanelComponent],
  templateUrl: './fines-mac-offence-code-hint.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacOffenceCodeHintComponent {
  private readonly offenceDetailsService = inject(FinesMacOffenceDetailsService);

  @Input() public offenceCode!: IOpalFinesOffencesRefData;
  @Input() public searchedOffenceCode: string | null = null;
  @Input() public selectedOffenceConfirmation!: boolean;

  public get matchedOffenceTitle(): string | null {
    return this.offenceDetailsService.findExactOffenceMatch(this.offenceCode, this.searchedOffenceCode)?.offence_title ?? null;
  }
}
