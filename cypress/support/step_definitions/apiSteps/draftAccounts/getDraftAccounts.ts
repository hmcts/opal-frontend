import { When } from '@badeball/cypress-cucumber-preprocessor';

When(
  'I click on the {string} link and intercept the rejected accounts request changing the count to {string}',
  (link: string, count: string) => {
    cy.intercept(
      'GET',
      '/opal-fines-service/draft-accounts?business_unit=73&business_unit=77&business_unit=65&business_unit=78&business_unit=80&business_unit=66&status=Rejected',
      (req) => {
        req.reply((res: any) => {
          res.body.count = count;
          return res;
        });
      },
    ).as('getDraftAccounts');
    cy.get('a').contains(link).click();

    cy.wait('@getDraftAccounts');
  },
);

When('I click on the rejected tab and ensure there are no accounts', () => {
  cy.fixture('/getDraftAccounts/zeroRejectedAccounts.json').then((zeroRejectedAccounts) => {
    cy.intercept(
      'GET',
      '/opal-fines-service/draft-accounts?business_unit=73&business_unit=77&business_unit=65&business_unit=78&business_unit=80&business_unit=66&status=Rejected&submitted_by=L073JG&submitted_by=L077JG&submitted_by=L065JG&submitted_by=L078JG&submitted_by=L080JG&submitted_by=L066JG',
      (req) => {
        req.continue((res) => {
          res.send(zeroRejectedAccounts);
        });
      },
    ).as('getRejectedDraftAccounts');
  });

  cy.get('opal-lib-moj-sub-navigation-item[subnavitemid="inputter-rejected-tab"]').children('li').children('a').click();

  cy.wait('@getRejectedDraftAccounts');
});

When('I click on the rejected tab and ensure there are three accounts', () => {
  cy.fixture('/getDraftAccounts/threeRejectedAccounts.json').then((threeRejectedAccounts) => {
    // Manipulate dates in the fixture before sending it back
    threeRejectedAccounts.summaries.forEach((summary: any, idx: number) => {
      const daysAgo = idx + 1;

      // Create a new Date for `daysAgo` days in the past
      const dateDaysAgo = new Date();
      dateDaysAgo.setDate(dateDaysAgo.getDate() - daysAgo);

      // Convert to ISO string
      const isoString = dateDaysAgo.toISOString();

      // Update created_at
      summary.created_at = isoString;

      // Update created_date within account_snapshot, if present
      if (summary.account_snapshot) {
        summary.account_snapshot.created_date = isoString;
      }
    });
    cy.intercept(
      'GET',
      '/opal-fines-service/draft-accounts?business_unit=73&business_unit=77&business_unit=65&business_unit=78&business_unit=80&business_unit=66&status=Rejected&submitted_by=L073JG&submitted_by=L077JG&submitted_by=L065JG&submitted_by=L078JG&submitted_by=L080JG&submitted_by=L066JG',
      (req) => {
        req.continue((res) => {
          res.send(threeRejectedAccounts);
        });
      },
    ).as('getRejectedDraftAccounts');
  });

  cy.get('opal-lib-moj-sub-navigation-item[subnavitemid="inputter-rejected-tab"]').children('li').children('a').click();

  cy.wait('@getRejectedDraftAccounts');
});
When('I click on the rejected tab and ensure there are 26 accounts', () => {
  cy.fixture('/getDraftAccounts/twentySixRejectedAccounts.json').then((twentySixRejectedAccounts) => {
    // Manipulate dates in the fixture before sending it back
    twentySixRejectedAccounts.summaries.forEach((summary: any, idx: number) => {
      const daysAgo = idx + 1;

      // Create a new Date for `daysAgo` days in the past
      const dateDaysAgo = new Date();
      dateDaysAgo.setDate(dateDaysAgo.getDate() - daysAgo);

      // Convert to ISO string
      const isoString = dateDaysAgo.toISOString();

      // Update created_at
      summary.created_at = isoString;

      // Update created_date within account_snapshot, if present
      if (summary.account_snapshot) {
        summary.account_snapshot.created_date = isoString;
      }
    });
    cy.intercept(
      'GET',
      '/opal-fines-service/draft-accounts?business_unit=73&business_unit=77&business_unit=65&business_unit=78&business_unit=80&business_unit=66&status=Rejected&submitted_by=L073JG&submitted_by=L077JG&submitted_by=L065JG&submitted_by=L078JG&submitted_by=L080JG&submitted_by=L066JG',
      (req) => {
        req.continue((res) => {
          res.send(twentySixRejectedAccounts);
        });
      },
    ).as('getRejectedDraftAccounts');
  });

  cy.get('opal-lib-moj-sub-navigation-item[subnavitemid="inputter-rejected-tab"]').children('li').children('a').click();

  cy.wait('@getRejectedDraftAccounts');
});
