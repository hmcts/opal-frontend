Here is the `README.md` for the `moj-timeline` component:

---

# MOJ Timeline Component

This Angular component provides a Ministry of Justice (MOJ)-styled timeline, typically used to display a chronological sequence of events.

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
import { MojTimelineComponent } from '@components/moj/moj-timeline/moj-timeline.component';
```

## Usage

You can use the timeline component in your template as follows:

```html
<app-moj-timeline [events]="timelineEvents"></app-moj-timeline>
```

### Example in HTML:

```html
<ul class="moj-timeline">
  <li *ngFor="let event of events" class="moj-timeline__item">
    <div class="moj-timeline__date">{{ event.date }}</div>
    <div class="moj-timeline__description">{{ event.description }}</div>
  </li>
</ul>
```

## Inputs

| Input    | Type    | Description                                                         |
| -------- | ------- | ------------------------------------------------------------------- |
| `events` | `Array` | Array of event objects, each containing a `date` and `description`. |

## Outputs

There are no custom outputs for this component.

## Methods

There are no custom methods for this component.

## Testing

Unit tests for this component can be found in the `moj-timeline.component.spec.ts` file. To run the tests, use:

```bash
ng test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.

---

This `README.md` explains how to use and configure the `moj-timeline` component for displaying a sequence of events in a timeline format, following MOJ design guidelines.
