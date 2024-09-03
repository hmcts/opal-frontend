Feature: Manual account creation - Adult or Youth screens - accessibility

  Scenario Outline: Manual account creation - Accessibility - Adult or Youth screens
    Given I am on the OPAL Frontend
    When I sign in as "opal-test@hmcts.net"
    And I navigate to Manual Account Creation
    And I enter "London South" into the business unit search box
    And I select the "Fine" radio button
    And I select the "Adult or youth" radio button
    And I click the "Continue" button

    When I click on the "<screen>" link
    Then I see "<pageHeading>" on the page header
    Then I check accessibility
    Then I click the Sign out link
    Examples:
      | screen           | pageHeading               |
      | Personal details | Personal details          |
      | Employer details | Employer details          |
      | Contact details  | Defendant contact details |

