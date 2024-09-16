Feature: PO-465 language preferences page for all defendant types
  Background:
    Given I am on the OPAL Frontend
    Then I see "Opal" in the header

  Scenario Outline:AC1,2,3,4 Language preferences for All defendants - happy path
    When I sign in as "opal-test-6@HMCTS.NET"
    Then I am on the dashboard
    When I navigate to Manual Account Creation

    Then I see "Business unit and defendant type" on the page header
    And I select the "Fine" radio button
    When I select the "<defendantType>" radio button
    And I click the "Continue" button

    Then I see the "Defendant type" is "<defendantType>" in the account details table
    And I see the "Document language" is "Welsh and English" in the account details table
    And I see the "Hearing language" is "Welsh and English" in the account details table

    Then I see "Defendant type" below "Account type" in the account details table
    And I see "Document language" below "Defendant type" in the account details table
    And I see "Hearing language" below "Document language" in the account details table

    Then I see "Document language" has a change link in the account details table
    And I see "Hearing language" has a change link in the account details table



    Examples:
      | defendantType                                 |
      | Adult or youth only                           |
      | Adult or youth with parent or guardian to pay |
      | Company                                       |

  Scenario Outline:AC1,2,3,4 Language preferences for All defendants - negative test
    When I sign in as "opal-test-10@HMCTS.NET"
    Then I am on the dashboard
    When I navigate to Manual Account Creation

    Then I see "Business unit and defendant type" on the page header
    And I select the "Fine" radio button
    When I select the "<defendantType>" radio button
    And I enter "West London" into the business unit search box
    And I click the "Continue" button

    Then I see the "Defendant type" is "<defendantType>" in the account details table

    Then I see "Defendant type" below "Account type" in the account details table
    And I do not see "Document language" in the account details table
    And I do not see "Hearing language" in the account details table

    Examples:
      | defendantType                                 |
      | Adult or youth only                           |
      | Adult or youth with parent or guardian to pay |
      | Company                                       |
