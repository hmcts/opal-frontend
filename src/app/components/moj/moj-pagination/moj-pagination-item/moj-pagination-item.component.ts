import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-moj-pagination-item',
  standalone: true,
  imports: [],
  templateUrl: './moj-pagination-item.component.html',
})
export class MojPaginationItemComponent {
  @Input() extraClasses = '';
  @Input() isActive: boolean = false;
}
