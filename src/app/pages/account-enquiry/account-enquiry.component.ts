import { ChangeDetectionStrategy, Component, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { StateService } from '@services';
import { ACCOUNT_ENQUIRY_DEFAULT_STATE } from '@constants';

@Component({
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './account-enquiry.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountEnquiryComponent implements OnDestroy {
  private readonly stateService = inject(StateService);

  ngOnDestroy(): void {
    // Cleanup our state when the route unloads...
    this.stateService.accountEnquiry = ACCOUNT_ENQUIRY_DEFAULT_STATE;

    // Clear any errors...
    this.stateService.error.set({
      error: false,
      message: '',
    });
  }
}
