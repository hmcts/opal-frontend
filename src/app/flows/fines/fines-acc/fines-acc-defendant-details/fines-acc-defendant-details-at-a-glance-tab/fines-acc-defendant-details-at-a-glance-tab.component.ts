import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FinesAccDetailsAccountDataBlockComponent } from '../../components/fines-acc-details-account-data-block/fines-acc-details-account-data-block.component';
import { IOpalFinesAccountDetailsAtAGlanceTabRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-details-tab-ref-data.interface';

@Component({
  selector: 'app-fines-acc-defendant-details-at-a-glance-tab',
  imports: [FinesAccDetailsAccountDataBlockComponent],
  templateUrl: './fines-acc-defendant-details-at-a-glance-tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccDefendantDetailsAtAGlanceTabComponent {
  @Input() tabData!: IOpalFinesAccountDetailsAtAGlanceTabRefData | null;
}
