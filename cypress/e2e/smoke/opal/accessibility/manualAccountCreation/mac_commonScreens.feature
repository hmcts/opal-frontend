Feature: Manual account creation - Common screens - accessibility
  Scenario: Manual account creation - Accessibility - User 1 BU
    Given I am on the OPAL Frontend
    When I sign in as "opal-test-3@hmcts.net"
    And I navigate to Manual Account Creation
    And I see "Business unit and defendant type" on the page header

    Then I check accessibility
    Then I click the Sign out link

  Scenario: Manual account creation - Accessibility - User multiple BUs
    Given I am on the OPAL Frontend
    When I sign in as "opal-test@hmcts.net"
    And I navigate to Manual Account Creation
    And I see "Business unit and defendant type" on the page header
    Then I check accessibility
    Then I click the Sign out link

  Scenario: Manual account creation - Accessibility - Create Account screen
    Given I am on the OPAL Frontend
    When I sign in as "opal-test@hmcts.net"
    And I navigate to Manual Account Creation
    And I enter "West London" into the business unit search box
    And I select the "Fine" radio button
    And I select the "Adult or youth with parent or guardian to pay" radio button
    And I click the "Continue" button

    Then I see "Account details" on the page header
    Then I check accessibility
    Then I click the Sign out link

  Scenario Outline: Manual account creation - Accessibility - Common screens
    Given I am on the OPAL Frontend
    When I sign in as "opal-test@hmcts.net"
    And I navigate to Manual Account Creation
    And I enter "West London" into the business unit search box
    And I select the "Fine" radio button
    And I select the "Adult or youth with parent or guardian to pay" radio button
    And I click the "Continue" button

    When I click on the "<screen>" link
    Then I see "<pageHeading>" on the page header
    Then I check accessibility
    Then I click the Sign out link
    Examples:
      | screen                     | pageHeading                                   |
      | Court details              | Court details                                 |
      | Contact details            | Parent or guardian contact details            |
      | Offence details            | Offence details                               |
      | Account comments and notes | Account comments and notes                    |
      | Delete account             | Are you sure you want to delete this account? |

  Scenario: Manual account creation - Accessibility - Welsh language screens
    Given I am on the OPAL Frontend
    When I sign in as "opal-test-8@hmcts.net"
    And I navigate to Manual Account Creation
    And I select the "Fine" radio button
    And I select the "Adult or youth" radio button
    And I click the "Continue" button

    Then I check accessibility

    Then I see "Account details" on the page header
    Then I click the "Document language" change link in the account details table

    Then I check accessibility
    Then I click the Sign out link


