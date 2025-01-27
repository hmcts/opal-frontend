import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-moj-pagination-item , [app-moj-pagination-item]',

  imports: [],
  templateUrl: './moj-pagination-item.component.html',
})
export class MojPaginationItemComponent {
  @HostBinding('class') class = 'moj-pagination__item';
}
