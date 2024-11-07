---

# MOJ Badge Component

This Angular component provides a Ministry of Justice (MOJ)-styled badge that displays labels or status indicators with customizable color and size options. It supports various color classes and an optional large size modifier.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Inputs](#inputs)
- [Class Modifiers](#class-modifiers)
- [Testing](#testing)
- [Contributing](#contributing)

## Installation

To use the `MojBadgeComponent` in your project, ensure that the component is imported and declared.

```typescript
import { MojBadgeComponent } from '@components/moj/moj-badge/moj-badge.component';
```

## Usage

You can use the badge component in your template as follows:

```html
<app-moj-badge badgeId="badge1" badgeClasses="moj-badge--purple">Lorem ipsum 1</app-moj-badge>
<app-moj-badge badgeId="badge2" badgeClasses="moj-badge--green moj-badge--large">Lorem ipsum 4</app-moj-badge>
```

### Example in HTML:

```html
<span class="moj-badge {{badgeClasses}}" [id]="badgeId"><ng-content></ng-content> </span>
```

## Inputs

| Input          | Type     | Description                                       |
| -------------- | -------- | ------------------------------------------------- |
| `badgeId`      | `string` | The unique identifier for the badge element.      |
| `badgeClasses` | `string` | The classes to apply color and size modifiers to the badge. |

## Class Modifiers

The `badgeClasses` input allows you to apply various color and size classes. Below are the available classes:

### Color Modifiers

- **`moj-badge--purple`**: `Lorem ipsum 1`
- **`moj-badge--bright-purple`**: `Lorem ipsum 2`
- **`moj-badge--red`**: `Lorem ipsum 3`
- **`moj-badge--green`**: `Lorem ipsum 4`
- **`moj-badge--blue`**: `Lorem ipsum 5`
- **`moj-badge--black`**: `Lorem ipsum 6`
- **`moj-badge--grey`**: `Lorem ipsum 7`

### Size Modifiers

You can combine any of the color modifiers above with the size modifier `moj-badge--large` to increase the badge size:

- **`moj-badge--purple moj-badge--large`**: Large `Lorem ipsum 1`
- **`moj-badge--bright-purple moj-badge--large`**: Large `Lorem ipsum 2`
- **`moj-badge--red moj-badge--large`**: Large `Lorem ipsum 3`
- **`moj-badge--green moj-badge--large`**: Large `Lorem ipsum 4`
- **`moj-badge--blue moj-badge--large`**: Large `Lorem ipsum 5`
- **`moj-badge--black moj-badge--large`**: Large `Lorem ipsum 6`
- **`moj-badge--grey moj-badge--large`**: Large `Lorem ipsum 7`

## Testing

Unit tests for this component can be found in the `moj-badge.component.spec.ts` file. To run the tests, use:

```bash
ng test
```

## Contributing

Feel free to submit issues or pull requests to improve this component. When contributing, ensure changes follow Angular and MOJ design system best practices.

---

This `README.md` provides an overview of the `moj-badge` component, including usage, inputs, and available class modifiers for color and size customization.
