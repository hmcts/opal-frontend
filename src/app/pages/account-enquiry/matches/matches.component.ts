import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StateService } from '@services';

@Component({
  selector: 'app-account-enquiry-matches',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './matches.component.html',
  styleUrl: './matches.component.scss',
})
export class MatchesComponent implements OnInit {
  private readonly stateService = inject(StateService);

  ngOnInit(): void {
    console.log(this.stateService.accountEnquiry());
  }
}
