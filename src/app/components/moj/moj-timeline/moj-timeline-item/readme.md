Here is the `README.md` for the `moj-timeline-item` component:

---

# MOJ Timeline Item Component

This Angular component represents an individual item in the MOJ timeline, used to display specific events in a timeline format.

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
import { MojTimelineItemComponent } from '@components/moj/moj-timeline-item/moj-timeline-item.component';
```

## Usage

You can use the timeline item component in your template as follows:

```html
<app-moj-timeline-item [date]="'2023-01-01'" [description]="'Event description'"></app-moj-timeline-item>
```

### Example in HTML:

```html
<li class="moj-timeline__item">
  <div class="moj-timeline__date">{{ date }}</div>
  <div class="moj-timeline__description">{{ description }}</div>
</li>
```

## Inputs

| Input         | Type     | Description                                  |
| ------------- | -------- | -------------------------------------------- |
| `date`        | `string` | The date associated with the timeline event. |
| `description` | `string` | The description of the event.                |

## Outputs

There are no custom outputs for this component.

## Methods

There are no custom methods for this component.

## Testing

Unit tests for this component can be found in the `moj-timeline-item.component.spec.ts` file. To run the tests, use:

```bash
ng test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.

---

This `README.md` provides instructions on how to use the `moj-timeline-item` component to display individual events within a timeline in an MOJ-styled format.
