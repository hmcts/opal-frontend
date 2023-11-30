import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { StateService } from '@services';

@Component({
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './account-enquiry.component.html',
  styleUrl: './account-enquiry.component.scss',
})
export class AccountEnquiryComponent implements OnInit, OnDestroy {
  private readonly stateService = inject(StateService);

  ngOnInit(): void {
    console.log('INIT');
    this.stateService.accountEnquiry.set({
      name: 'max',
    });
  }
  ngOnDestroy(): void {
    console.log('DESTROYED');
    this.stateService.accountEnquiry.set({});
  }
}
