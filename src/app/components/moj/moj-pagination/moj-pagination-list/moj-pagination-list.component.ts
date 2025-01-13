import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-moj-pagination-list , [app-moj-pagination-list]',
  standalone: true,
  imports: [],
  templateUrl: './moj-pagination-list.component.html',
})
export class MojPaginationListComponent {
  @HostBinding('class') class = 'moj-pagination__list';
}
