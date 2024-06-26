import { ChangeDetectionStrategy, Component, HostListener, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AeStateService, GlobalStateService } from '@services';
import { ACCOUNT_ENQUIRY_DEFAULT_STATE } from '@constants';

@Component({
  standalone: true,
  imports: [CommonModule, RouterOutlet],

  templateUrl: './account-enquiry.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountEnquiryComponent implements OnDestroy {
  private readonly globalStateService = inject(GlobalStateService);
  private readonly aeStateService = inject(AeStateService);
  @HostListener('window:beforeunload', ['$event'])
  handleBeforeUnload(): boolean {
    return this.aeStateService.accountEnquiry.search.court === null;
  }

  ngOnDestroy(): void {
    // Cleanup our state when the route unloads...
    this.aeStateService.accountEnquiry = ACCOUNT_ENQUIRY_DEFAULT_STATE;

    // Clear any errors...
    this.globalStateService.error.set({
      error: false,
      message: '',
    });
  }
}
