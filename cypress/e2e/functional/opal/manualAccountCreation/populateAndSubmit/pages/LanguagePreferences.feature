@manualAccountCreation @languagePreferences @PO-272 @PO-344 @PO-345 @PO-545 @PO-464 @PO-465 @PO-542 @PO-544
Feature: Manual account creation - Language preferences
  #This feature file contains tests for the Language preferences page of the Manual Account Creation journey that cannot be exercised in the component tests #

  @skip
  Scenario: Entered data persists in the session
    Given I am on the Opal Frontend and I sign in as "opal-test-8@HMCTS.NET"
    Then I am on the dashboard
    When I navigate to Manual Account Creation

    Then I see "Business unit and defendant type" on the page header
    And I select the "Fine" radio button
    And I select the "Adult or youth only" radio button
    And I click the "Continue" button

    And I see the "Document language" is "English only" in the account details table
    And I see the "Hearing language" is "English only" in the account details table

    Then I click the "Document language" change link in the account details table

    And I see "Language preferences" on the page header
    And I see the "Welsh and English" radio button under the "Documents" section
    And I see the "English only" radio button under the "Documents" section

    When I select the "Welsh and English" radio button under the "Documents" section
    And I select the "Welsh and English" radio button under the "Court hearings" section
    And I click the "Save" button

    Then I see the "Document language" is "Welsh and English" in the account details table
    And I see the "Hearing language" is "Welsh and English" in the account details table

    Then I click the "Hearing language" change link in the account details table

    And I see the "Welsh and English" radio button under the "Documents" section is selected
    And I see the "Welsh and English" radio button under the "Court hearings" section is selected

    Then I reload the page

    Then I see "Business unit and defendant type" on the page header
    And I select the "Fine" radio button
    And I select the "Adult or youth only" radio button
    And I click the "Continue" button

    And I see the "Document language" is "English only" in the account details table
    And I see the "Hearing language" is "English only" in the account details table

    Then I click the "Document language" change link in the account details table

    And I see "Language preferences" on the page header
    And I see the "English only" radio button under the "Documents" section is selected
    And I see the "Welsh and English" radio button under the "Documents" section is not selected

    And I see the "English only" radio button under the "Court hearings" section is selected
    And I see the "Welsh and English" radio button under the "Court hearings" section is not selected


  Scenario: Unsaved data is cleared when cancel is clicked
    Given I am on the Opal Frontend and I sign in as "opal-test-8@HMCTS.NET"
    Then I am on the dashboard
    When I navigate to Manual Account Creation

    Then I see "Business unit and defendant type" on the page header
    And I select the "Fine" radio button
    And I select the "Adult or youth only" radio button
    And I click the "Continue" button

    And I see the "Document language" is "English only" in the account details table
    And I see the "Hearing language" is "English only" in the account details table

    Then I click the "Document language" change link in the account details table

    And I see "Language preferences" on the page header
    When I select the "Welsh and English" radio button under the "Documents" section
    And I select the "Welsh and English" radio button under the "Court hearings" section

    And I click Cancel, a window pops up and I click Cancel

    Then I see the "Welsh and English" radio button under the "Documents" section is selected
    And I see the "Welsh and English" radio button under the "Court hearings" section is selected

    Then I click Cancel, a window pops up and I click Ok

    Then I see the "Document language" is "English only" in the account details table
    And I see the "Hearing language" is "English only" in the account details table

    Then I click the "Document language" change link in the account details table

    And I see "Language preferences" on the page header
    And I see the "English only" radio button under the "Documents" section is selected
    And I see the "Welsh and English" radio button under the "Documents" section is not selected

    And I see the "English only" radio button under the "Court hearings" section is selected
    And I see the "Welsh and English" radio button under the "Court hearings" section is not selected


  Scenario: Language preferences - Axe Core
    Given I am on the Opal Frontend and I sign in as "opal-test-8@HMCTS.NET"
    Then I am on the dashboard
    When I navigate to Manual Account Creation

    Then I see "Business unit and defendant type" on the page header
    And I select the "Fine" radio button
    And I select the "Adult or youth only" radio button
    And I click the "Continue" button

    And I see the "Document language" is "English only" in the account details table
    And I see the "Hearing language" is "English only" in the account details table

    Then I click the "Document language" change link in the account details table

    Then I check accessibility


