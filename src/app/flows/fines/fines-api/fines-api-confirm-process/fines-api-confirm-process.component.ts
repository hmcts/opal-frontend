import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FINES_API_CONFIRM_PROCESS_CONTENT } from './constants/fines-api-confirm-process-content.constant';

@Component({
  selector: 'app-fines-api-confirm-process',
  templateUrl: './fines-api-confirm-process.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesApiConfirmProcessComponent {
  protected readonly content = FINES_API_CONFIRM_PROCESS_CONTENT;
}
