import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'daysAgo',
  standalone: true,
})
export class DaysAgoPipe implements PipeTransform {
  transform(value: number): string {
    if (value === 0) {
      return 'Today';
    } else if (value === 1) {
      return '1 day ago';
    } else if (value === -1) {
      return 'Tomorrow';
    } else if (value > 1) {
      return `${value} days ago`;
    } else if (value < -1) {
      return `In ${Math.abs(value)} days`;
    } else {
      return 'Invalid date';
    }
  }
}
