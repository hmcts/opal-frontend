---

# MOJ Ticket Panel Component

This Angular component provides a Ministry of Justice (MOJ)-styled ticket panel, typically used to display information or actions related to a specific item in a panel format.

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
import { MojTicketPanelComponent } from '@components/moj/moj-ticket-panel/moj-ticket-panel.component';
```

## Usage

You can use the ticket panel component in your template as follows:

```html
<app-moj-ticket-panel [ticketNumber]="'12345'" [ticketStatus]="'Open'"></app-moj-ticket-panel>
```

### Example in HTML:

```html
<div class="moj-ticket-panel">
  <div class="moj-ticket-panel__number">{{ ticketNumber }}</div>
  <div class="moj-ticket-panel__status">{{ ticketStatus }}</div>
  <ng-content></ng-content>
</div>
```

## Inputs

| Input          | Type     | Description                                                |
| -------------- | -------- | ---------------------------------------------------------- |
| `ticketNumber` | `string` | The number or ID of the ticket.                            |
| `ticketStatus` | `string` | The current status of the ticket (e.g., 'Open', 'Closed'). |

## Outputs

There are no custom outputs for this component.

## Methods

There are no custom methods for this component.

## Testing

Unit tests for this component can be found in the `moj-ticket-panel.component.spec.ts` file. To run the tests, use:

```bash
ng test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.

---

This `README.md` provides guidance on how to use the `moj-ticket-panel` component to display ticket information in a panel format, following MOJ design standards.
