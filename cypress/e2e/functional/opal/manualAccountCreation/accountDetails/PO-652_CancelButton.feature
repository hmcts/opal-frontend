Feature: PO-652 Move 'Cancel' button to beneath the navigation buttons

  #Covered parent or guardian scenario on PO-569, AC-6
  #Covered company scenarios on PO-365, AC6

  Scenario: AC1 - Cancel button on Create account page, Personal details page, contact details page, Employer details page and account notes and comments
    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard
    When I navigate to Manual Account Creation

    Then I see "Business unit and defendant type" on the page header
    And I enter "West London" into the business unit search box
    And I select the "Fine" radio button
    And I select the "Adult or youth only" radio button

    When I see the "Cancel" link
    Then I click Cancel, a window pops up and I click Ok
    And I am on the dashboard

    When I navigate to Manual Account Creation
    Then I see "Business unit and defendant type" on the page header
    And I enter "West London" into the business unit search box
    And I select the "Fine" radio button
    And I select the "Adult or youth only" radio button

    And I click the "Continue" button
    Then I see "Account details" on the page header

    Then I see the "Court details" section heading
    And I see the "Court details" link under the "Court details" section
    Then I see the status of "Court details" is "Not provided"
    And I click on the "Court details" link

    When I see the "Cancel" link
    Then I click on the "Cancel" link
    Then I see "Account details" on the page header

    Then I see the "Defendant details" section heading
    And I see the "Personal details" link under the "Defendant details" section
    And I click on the "Personal details" link
    Then I see "Personal details" on the page header

    When I see the "Cancel" link
    Then I click on the "Cancel" link
    Then I see "Account details" on the page header

    Then I see the "Defendant details" section heading
    And I see the "Contact details" link under the "Defendant details" section
    And I click on the "Contact details" link
    Then I see "Defendant contact details" on the page header

    When I see the "Cancel" link
    Then I click on the "Cancel" link
    Then I see "Account details" on the page header

    Then I see the "Defendant details" section heading
    And I see the "Employer details" link under the "Defendant details" section
    And I click on the "Employer details" link
    Then I see "Employer details" on the page header

    When I see the "Cancel" link
    Then I click on the "Cancel" link
    Then I see "Account details" on the page header

    Then I see the "Account comments and notes" section heading
    And I see the "Account comments and notes" link under the "Account comments and notes" section
    And I click on the "Account comments and notes" link
    Then I see "Account comments and notes" on the page header

    When I see the "Cancel" link
    Then I click on the "Cancel" link
    Then I see "Account details" on the page header

  Scenario: AC1 - Cancel button on Language preference for Create account page, Personal details page, contact details page, Employer details page and account notes and comments
    Given I am on the Opal Frontend and I sign in as "opal-test-6@HMCTS.NET"
    Then I am on the dashboard
    When I navigate to Manual Account Creation

    Then I see "Business unit and defendant type" on the page header
    When I see the "Cancel" link
    Then I click on the "Cancel" link
    Then I am on the dashboard
    When I navigate to Manual Account Creation

    Then I see "Business unit and defendant type" on the page header
    And I select the "Fine" radio button
    When I select the "Adult or youth only" radio button
    And I click the "Continue" button

    Then I see the "Defendant type" is "Adult or youth only" in the account details table
    And I see the "Document language" is "Welsh and English" in the account details table
    And I see the "Hearing language" is "Welsh and English" in the account details table

    Then I see the "Court details" section heading
    And I see the "Court details" link under the "Court details" section
    Then I see the status of "Court details" is "Not provided"
    And I click on the "Court details" link

    When I see the "Cancel" link
    Then I click on the "Cancel" link
    Then I see "Account details" on the page header

    Then I see the "Defendant details" section heading
    And I see the "Personal details" link under the "Defendant details" section
    And I click on the "Personal details" link
    Then I see "Personal details" on the page header

    When I see the "Cancel" link
    Then I click on the "Cancel" link
    Then I see "Account details" on the page header

    Then I see the "Defendant details" section heading
    And I see the "Contact details" link under the "Defendant details" section
    And I click on the "Contact details" link
    Then I see "Defendant contact details" on the page header

    When I see the "Cancel" link
    Then I click on the "Cancel" link
    Then I see "Account details" on the page header

    Then I see the "Defendant details" section heading
    And I see the "Employer details" link under the "Defendant details" section
    And I click on the "Employer details" link
    Then I see "Employer details" on the page header

    When I see the "Cancel" link
    Then I click on the "Cancel" link
    Then I see "Account details" on the page header

    Then I see the "Account comments and notes" section heading
    And I see the "Account comments and notes" link under the "Account comments and notes" section
    And I click on the "Account comments and notes" link
    Then I see "Account comments and notes" on the page header

    When I see the "Cancel" link
    Then I click on the "Cancel" link
    Then I see "Account details" on the page header









