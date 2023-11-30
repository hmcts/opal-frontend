import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-account-enquiry',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent {}
