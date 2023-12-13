import { ChangeDetectionStrategy, Component, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { StateService } from '@services';

@Component({
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './account-enquiry.component.html',
  styleUrl: './account-enquiry.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountEnquiryComponent implements OnDestroy {
  private readonly stateService = inject(StateService);

  ngOnDestroy(): void {
    // Cleanup our state when the route unloads...
    this.stateService.accountEnquiry.set({});
  }
}
