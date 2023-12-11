import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { MatTableModule } from '@angular/material/table';

import { GovukButtonComponent } from '@components';
import { AccountEnquiryRoutes } from '@enums';

export interface SearchResults {
  accountNo: string;
  name: string;
  dateOfBirth: string;
  addressLine1: string;
  balance: string;
  court: string;
}

const ELEMENT_DATA: SearchResults[] = [
  {
    accountNo: '16000621W  ',
    name: 'SMITH, AAA Mr  ',
    dateOfBirth: '01/01/1970  ',
    addressLine1: 'ASDF  ',
    balance: '£0.34  ',
    court: 'West London  ',
  },
  {
    accountNo: '18000027D  ',
    name: 'Smith, David Mr  ',
    dateOfBirth: '01/09/2003  ',
    addressLine1: '1 St. Kilda Road  ',
    balance: '£200.00  ',
    court: 'West London  ',
  },
  {
    accountNo: '16000398C  ',
    name: 'Smith, Joe Mr  ',
    dateOfBirth: '18/01/1995  ',
    addressLine1: '123 The Road  ',
    balance: '£1,000.00  ',
    court: 'West London  ',
  },
  {
    accountNo: '16000379A  ',
    name: 'Smith, John Mr  ',
    dateOfBirth: '01/08/1995  ',
    addressLine1: '1 London Rd  ',
    balance: '£1,100.00  ',
    court: 'West London  ',
  },
  {
    accountNo: '15000284C  ',
    name: 'Smith, Johnny Mr  ',
    dateOfBirth: '18/01/1954  ',
    addressLine1: '1 dahidsah dhsia  ',
    balance: '£100.00  ',
    court: 'West London  ',
  },
  {
    accountNo: '19000245V  ',
    name: 'Smith, Patrick Mr  ',
    dateOfBirth: '07/02/1966  ',
    addressLine1: '55 Queens Road  ',
    balance: '£220.00  ',
    court: 'West London  ',
  },
  {
    accountNo: '19000258I  ',
    name: 'Smith, Paul Mr  ',
    dateOfBirth: '07/02/1965  ',
    addressLine1: '55 Queens Road  ',
    balance: '£100.00  ',
    court: 'West London  ',
  },
  {
    accountNo: '15000302N  ',
    name: 'smith, Rocky Mr  ',
    dateOfBirth: '01/01/1980  ',
    addressLine1: 'adsad  ',
    balance: '£90,898.09  ',
    court: 'West London  ',
  },
  {
    accountNo: '16000417J  ',
    name: 'SMITH1, Kwame Mr  ',
    dateOfBirth: '26/11/1997  ',
    addressLine1: 'Flat 2  ',
    balance: '£100.00  ',
    court: 'West London  ',
  },
  {
    accountNo: '16000418F  ',
    name: 'SMITH2, Ahmed Hady Marian  ',
    dateOfBirth: '28/06/1991  ',
    addressLine1: 'Flat 3  ',
    balance: '£100.00  ',
    court: 'West London  ',
  },
  {
    accountNo: '18000035K  ',
    name: 'Smithen, David Mr  ',
    dateOfBirth: '10/12/1980  ',
    addressLine1: '12 Havens Crescent  ',
    balance: '£100.67  ',
    court: 'West London',
  },
];

@Component({
  selector: 'app-account-enquiry-matches',
  standalone: true,
  imports: [CommonModule, RouterModule, GovukButtonComponent, MatTableModule],
  templateUrl: './matches.component.html',
  styleUrl: './matches.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatchesComponent {
  private readonly router = inject(Router);
  displayedColumns: string[] = ['accountNo', 'name', 'dateOfBirth', 'addressLine1', 'balance', 'court'];
  dataSource = ELEMENT_DATA;

  public handleBack(): void {
    this.router.navigate([AccountEnquiryRoutes.search]);
  }
}
