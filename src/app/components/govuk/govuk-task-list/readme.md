Here is the `README.md` for the `govuk-task-list` component:

---

# GOV.UK Task List Component

This Angular component renders a GOV.UK-styled task list, typically used to display a set of steps or tasks that users need to complete.

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
import { GovukTaskListComponent } from '@components/govuk/govuk-task-list/govuk-task-list.component';
```

## Usage

You can use the task list component in your template as follows:

```html
<app-govuk-task-list [tasks]="tasksData"></app-govuk-task-list>
```

### Example in HTML:

```html
<ol class="govuk-task-list">
  <li *ngFor="let task of tasks" class="govuk-task-list__item">
    <a class="govuk-link" href="{{ task.link }}">{{ task.title }}</a>
    <strong class="govuk-tag govuk-task-list__tag">{{ task.status }}</strong>
  </li>
</ol>
```

## Inputs

| Input   | Type    | Description                                                     |
| ------- | ------- | --------------------------------------------------------------- |
| `tasks` | `Array` | Array of task objects containing `title`, `link`, and `status`. |

## Outputs

There are no custom outputs for this component.

## Methods

There are no custom methods for this component.

## Testing

Unit tests for this component can be found in the `govuk-task-list.component.spec.ts` file. To run the tests, use:

```bash
ng test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.

---

This `README.md` provides an overview of how to use and configure the `govuk-task-list` component to display a series of tasks in GOV.UK styling.
