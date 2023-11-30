import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StateService } from '@services';

@Component({
  selector: 'app-account-enquiry',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent implements OnInit {
  private readonly stateService = inject(StateService);

  ngOnInit(): void {
    console.log(this.stateService.accountEnquiry());
    this.stateService.accountEnquiry.update((val) => ({ ...val, age: 32 }));
  }
}
