// accessibility.steps.ts
import { Then } from '@badeball/cypress-cucumber-preprocessor';
import type { DataTable } from '@badeball/cypress-cucumber-preprocessor';
import { accessibilityActions } from '../../../../e2e/functional/opal/actions/accessibility/accessibility.actions';

Then('I check the page for accessibility', () => {
  accessibilityActions().checkAccessibilityOnly();
});

Then('I check the page for accessibility and navigate back', () => {
  accessibilityActions().checkAccessibilityAndNavigateBack();
});

Then('I navigate to each URL in the datatable and check for accessibility', (dataTable: DataTable) => {
  accessibilityActions().checkAccessibilityForUrls(dataTable);
});
