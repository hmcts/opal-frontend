import { Component } from '@angular/core';
import {
  GovukButtonComponent,
  GovukTagComponent,
  GovukTaskListComponent,
  GovukTaskListItemComponent,
} from '@components';

@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [GovukTagComponent, GovukTaskListComponent, GovukTaskListItemComponent, GovukButtonComponent],
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.scss',
})
export class CreateAccountComponent {}
