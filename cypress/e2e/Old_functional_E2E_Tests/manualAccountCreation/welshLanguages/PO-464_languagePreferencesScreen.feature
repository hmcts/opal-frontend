Feature: PO-464 Language Preferences Screen




  Scenario Outline: AC1,2aii,2b,3 - South Wales BU - 'English Only' default
    Given I am on the Opal Frontend and I sign in as "opal-test-8@HMCTS.NET"
    Then I am on the dashboard
    When I navigate to Manual Account Creation

    Then I see "Business unit and defendant type" on the page header
    And I select the "Fine" radio button
    And I select the "<defendantType>" radio button
    And I click the "Continue" button
    And I see the "Document language" is "English only" in the account details table
    And I see the "Hearing language" is "English only" in the account details table

    Then I click the "Document language" change link in the account details table

    And I see "Language preferences" on the page header
    And I see the "Welsh and English" radio button under the "Documents" section
    And I see the "English only" radio button under the "Documents" section

    And I see the "Welsh and English" radio button under the "Court hearings" section
    And I see the "English only" radio button under the "Court hearings" section

    Then I see the "English only" radio button under the "Documents" section is selected
    And I see the "English only" radio button under the "Court hearings" section is selected
    And I see the "Welsh and English" radio button under the "Documents" section is not selected
    And I see the "Welsh and English" radio button under the "Court hearings" section is not selected

    When I select the "Welsh and English" radio button under the "Documents" section
    And I select the "Welsh and English" radio button under the "Court hearings" section
    And I click the "Save" button

    Then I see the "Document language" is "Welsh and English" in the account details table
    And I see the "Hearing language" is "Welsh and English" in the account details table

    Then I click the "Hearing language" change link in the account details table
    And I see the "Welsh and English" radio button under the "Documents" section is selected
    And I see the "Welsh and English" radio button under the "Court hearings" section is selected
    Examples:
      | defendantType       |
      | Adult or youth only |


  Scenario Outline: AC1,2ai,3 - Wales BU - 'Welsh and English' default
    Given I am on the Opal Frontend and I sign in as "opal-test-6@HMCTS.NET"
    Then I am on the dashboard
    When I navigate to Manual Account Creation

    Then I see "Business unit and defendant type" on the page header
    And I select the "Fine" radio button
    And I select the "<defendantType>" radio button
    And I click the "Continue" button
    And I see the "Document language" is "Welsh and English" in the account details table
    And I see the "Hearing language" is "Welsh and English" in the account details table
    Examples:
      | defendantType       |
      | Adult or youth only |

  Scenario Outline: AC4 - Cancel clicked on the language preferences screen
    Given I am on the Opal Frontend and I sign in as "opal-test-8@HMCTS.NET"
    Then I am on the dashboard
    When I navigate to Manual Account Creation

    Then I see "Business unit and defendant type" on the page header
    And I select the "Fine" radio button
    And I select the "<defendantType>" radio button
    And I click the "Continue" button

    Then I click the "Document language" change link in the account details table
    And I select the "Welsh and English" radio button under the "Documents" section
    And I select the "Welsh and English" radio button under the "Court hearings" section

    When I click Cancel, a window pops up and I click Ok
    Then I see the "Document language" is "English only" in the account details table
    And I see the "Hearing language" is "English only" in the account details table

    Then I click the "Document language" change link in the account details table
    And I select the "Welsh and English" radio button under the "Documents" section
    And I select the "Welsh and English" radio button under the "Court hearings" section

    When I click Cancel, a window pops up and I click Cancel
    Then I see the "Welsh and English" radio button under the "Documents" section is selected
    And I see the "Welsh and English" radio button under the "Court hearings" section is selected


    Examples:
      | defendantType       |
      | Adult or youth only |
