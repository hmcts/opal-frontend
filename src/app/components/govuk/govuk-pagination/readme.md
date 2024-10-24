---

# GOV.UK Pagination Component

This Angular component provides a GOV.UK-styled pagination system, enabling users to navigate between multiple pages of results.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Inputs](#inputs)
- [Outputs](#outputs)
- [Methods](#methods)
- [Testing](#testing)
- [Contributing](#contributing)

## Installation

```typescript
import { GovukPaginationComponent } from '@components/govuk/govuk-pagination/govuk-pagination.component';
```

## Usage

You can use the pagination component in your template as follows:

```html
<app-govuk-pagination [currentPage]="1" [totalPages]="10" (pageChange)="onPageChange($event)"></app-govuk-pagination>
```

### Example in HTML:

```html
<nav *ngIf="pages().length > 1" class="govuk-pagination" role="navigation" aria-label="results">
  <div *ngIf="currentPage > 1" class="govuk-pagination__prev">
    <a class="govuk-link govuk-pagination__link" href="#" rel="prev" (click)="onPageChanged($event, currentPage - 1)">
      <svg class="govuk-pagination__icon govuk-pagination__icon--prev" height="13" width="15" aria-hidden="true">
        <path d="M6.59-0.01L-0.14 6.72 6.74 13.13l1.38-1.45L3.94 7.71h12.9v-2H3.86l4.29-4.29L6.59-0.01z"></path>
      </svg>
      <span class="govuk-pagination__link-title">Previous</span>
    </a>
  </div>
  <ul class="govuk-pagination__list">
    <li
      *ngFor="let page of elipsedPages()"
      class="govuk-pagination__item"
      [class.govuk-pagination__item--current]="page === currentPage"
      [class.govuk-pagination__item--ellipses]="page === ELIPSIS"
    >
      <ng-container *ngIf="page === ELIPSIS">&ctdot;</ng-container>
      <a
        *ngIf="page !== ELIPSIS"
        class="govuk-link govuk-pagination__link"
        href="#"
        (click)="onPageChanged($event, +page)"
      >
        {{ page }}
      </a>
    </li>
  </ul>
  <div *ngIf="currentPage < pages().length" class="govuk-pagination__next">
    <a class="govuk-link govuk-pagination__link" href="#" rel="next" (click)="onPageChanged($event, currentPage + 1)">
      <span class="govuk-pagination__link-title">Next</span>
      <svg class="govuk-pagination__icon govuk-pagination__icon--next" height="13" width="15" aria-hidden="true">
        <path d="M8.11-0.01L6.7 1.41l4.29 4.29H-2v2H10.9L6.71 11.7l1.38 1.45 6.74-6.41L8.11-0.01z"></path>
      </svg>
    </a>
  </div>
</nav>
```

## Inputs

| Input         | Type     | Description                                         |
| ------------- | -------- | --------------------------------------------------- |
| `currentPage` | `number` | The current active page.                            |
| `totalPages`  | `number` | The total number of pages available for navigation. |

## Outputs

| Output       | Description                                                          |
| ------------ | -------------------------------------------------------------------- |
| `pageChange` | Event emitted when the page is changed, passing the new page number. |

## Methods

### `onPageChanged(event: Event, page: number)`

This method handles the page change when a user clicks a page number or the next/previous buttons.

```typescript
onPageChanged(event: Event, page: number): void {
  event.preventDefault();
  // Logic for handling page change
}
```

## Testing

Unit tests for this component can be found in the `govuk-pagination.component.spec.ts` file. To run the tests, use:

```bash
ng test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.

---

This `README.md` explains how to use the `govuk-pagination` component, configure it with the current and total pages, and handle page changes.
