---
# MojPaginationComponent

The `MojPaginationComponent` is a reusable Angular component that provides pagination functionality for applications. It supports dynamic page generation, ellipses for skipped pages, and custom event handling for page navigation.
---

## Features

- **Dynamic Pagination**: Automatically calculates the total pages based on the provided data and displays appropriate page links.
- **Ellipses Support**: Includes ellipses (`...`) to represent skipped pages when the total number of pages exceeds the maximum visible pages.
- **Event-Driven Navigation**: Emits custom events on page changes for seamless integration with parent components.
- **Accessibility**: Fully accessible navigation with `aria-label` support for screen readers.
- **Customizable Limits**: Supports configurable page limits and item counts.

---

## Usage

### **Component Integration**

1. Import the `MojPaginationComponent` into your Angular module or use it as a standalone component.

2. Add the following code to your HTML file where you want to display pagination:

```html
<app-moj-pagination
  [limit]="10"
  [maxPagesToShow]="2"
  [total]="100"
  [currentPage]="currentPage"
  (changePage)="onPageChange($event)"
></app-moj-pagination>
```

### **Input Properties**

| Property         | Type   | Default | Description                              |
| ---------------- | ------ | ------- | ---------------------------------------- |
| `limit`          | number | `10`    | Number of items per page.                |
| `total`          | number | `0`     | Total number of items to paginate.       |
| `currentPage`    | number | `1`     | The currently active page number.        |
| `maxPagesToShow` | number | `1`     | Total number of pages to show before ... |

### **Output Events**

| Event        | Description                                       |
| ------------ | ------------------------------------------------- |
| `changePage` | Emits the new page number when a page is clicked. |

---

## Example

Here’s how you can use the component in your parent component:

ps. The inputs are optional for configuration as these values already have default values( excl currentPage and changePage).

### **Parent Component Template**

```html
<app-moj-pagination
  [limit]="10"
  [maxPagesToShow]="2"
  [total]="100"
  [currentPage]="currentPage"
  (changePage)="onPageChange($event)"
></app-moj-pagination>
```

### **Parent Component Class**

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  currentPage = 1;

  onPageChange(newPage: number): void {
    console.log('Page changed to:', newPage);
    this.currentPage = newPage;
  }
}
```

---

## Testing

This component includes comprehensive unit tests to ensure correct functionality. To run the tests, use:

```bash
yarn test
```

### Test Cases

- **Page Calculation**: Verifies the correct number of pages and ellipses.
- **Event Emission**: Ensures the `changePage` event emits the correct page number.
- **Edge Cases**: Tests pagination with large datasets, single pages, and out-of-bound page clicks.

---

## Known Issues

- Ensure that the `total` and `limit` inputs are correctly set; otherwise, pagination may behave unexpectedly.
- Requires Angular 17 or later for the `@for` syntax.

---

## Contribution

Feel free to contribute by creating issues or submitting pull requests to improve the component or add new features.
