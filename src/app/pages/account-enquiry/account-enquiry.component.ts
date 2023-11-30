import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './account-enquiry.component.html',
  styleUrl: './account-enquiry.component.scss',
})
export class AccountEnquiryComponent implements OnInit, OnDestroy {
  ngOnInit(): void {
    console.log('INIT');
  }
  ngOnDestroy(): void {
    console.log('DESTROYED');
  }
}
