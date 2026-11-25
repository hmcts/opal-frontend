import { Then, When } from '@badeball/cypress-cucumber-preprocessor';
import {
  FinanceBankingInterfaceLink,
  SuspensePermissionCombination,
} from '../../e2e/functional/opal/actions/finance/finance.actions';
import { FinanceFlow } from '../../e2e/functional/opal/flows/finance.flow';
import { VariantBankingUploadFlow } from '../../e2e/functional/opal/flows/variant-banking-upload.flow';
import { log } from '../utils/log.helper';

const financeFlow = () => new FinanceFlow();
const variantBankingUploadFlow = () => new VariantBankingUploadFlow();

Then('I see the External banking interfaces section and its available links', () => {
  log('assert', 'Checking Finance banking-interface links are visible');
  financeFlow().assertBankingInterfacesSectionAndLinks();
});

When('I open the Finance banking interface link {string}', (linkLabel: FinanceBankingInterfaceLink) => {
  log('step', 'Opening a Finance banking-interface link', { linkLabel });
  financeFlow().openBankingInterfaceLink(linkLabel);
});

Then('I can upload multiple Variant Banking files successfully', () => {
  log('step', 'Uploading multiple Variant Banking files');
  variantBankingUploadFlow().verifySuccessfulMultiFileUpload();
});

Then('my Suspense permissions are {string}', (combination: SuspensePermissionCombination) => {
  financeFlow().assertSuspensePermissions(combination);
});

Then('I see the Suspense section and its Manage Suspense Items link', () => {
  financeFlow().assertSuspenseSectionVisible();
});

Then('I do not see the Suspense section or its Manage Suspense Items link', () => {
  financeFlow().assertSuspenseSectionHidden();
});

When('I open Manage Suspense Items from Finance', () => {
  financeFlow().openSuspenseItems();
});

Then('I am on the Suspense search page', () => {
  financeFlow().assertSuspenseSearchPage();
});
