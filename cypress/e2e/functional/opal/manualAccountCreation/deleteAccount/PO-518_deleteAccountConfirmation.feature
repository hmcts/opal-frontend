Feature: PO-518 delete account confirmation screen

  Background:
    Given I am on the OPAL Frontend
    Then I see "Opal" in the header

    When I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard
    When I navigate to Manual Account Creation

    Then I see "Business unit and defendant type" on the page header
    And I enter "London South" into the business unit search box
    And I select the "Fine" radio button


  Scenario Outline: AC1,2,3,4,5 - Delete account confirmation screen
    And I select the "<defendantType>" radio button
    And I click the "Continue" button

    When I click on the "Contact details" link
    Then I see "Defendant contact details" on the page header
    And I enter "test@test.com" into the "Primary email address" field
    And I click the "Return to account details" button
    And I see the status of "Contact details" is "Provided"

    Then I click on the "Delete account" link
    Then I see "Are you sure you want to delete this account?" on the page header

    When I click on the "Cancel" link
    Then I see the status of "Contact details" is "Provided"

    When I click on the "Delete account" link
    Then I see "Are you sure you want to delete this account?" on the page header

    When I click the "Yes - delete" button
    Then I see "Business unit and defendant type" on the page header
    And I see "London South West" in the "Business unit" searchbox
    Examples:
      | defendantType                                 |
      | Adult or youth only                           |
      | Adult or youth with parent or guardian to pay |
      | Company                                       |
