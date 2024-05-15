import { Component } from '@angular/core';
import { GovukTagComponent, GovukTaskListComponent, GovukTaskListItemComponent } from '@components';

@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [GovukTagComponent, GovukTaskListComponent, GovukTaskListItemComponent],
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.scss',
})
export class CreateAccountComponent {}
