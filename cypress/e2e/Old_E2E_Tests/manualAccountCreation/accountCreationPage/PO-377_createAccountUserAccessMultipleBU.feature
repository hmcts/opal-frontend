Feature: PO-377 manual account creation, user has access to multiple BU's
  Feature Description
  https://tools.hmcts.net/jira/browse/PO-377
  UI - Business unit and defendant type screen - Introduce View 2 - Users associated to 2 or more BU's
  Scenario: AC1 - Business unit heading and Create account caption
    Given I am on the Opal Frontend and I sign in as "opal-test-3@HMCTS.NET"
    Then I am on the dashboard

    When I navigate to Manual Account Creation

    #Descoped by PO-426 --- Then I see "Create account" as the caption on the page
    Then I see "Business unit and defendant type" on the page header

  Scenario: AC2 - Business unit search box
    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard

    When I navigate to Manual Account Creation

    Then I see the business unit heading is "Business unit"
    Then I see the business unit help text is "Enter area where the account is to be created"
    Then I see the search box below the business unit help text

    When I enter "West London" into the business unit search box
    Then I see the value "West London" in the business unit search box

  Scenario: AC3 - Defendant type - radio buttons
    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard

    When I navigate to Manual Account Creation

    When I select the "Fine" radio button
    And I see the heading under the fine radio button is "Defendant type"
    #Then I see the defendant type help text is "If sole trader, choose 'Adult or youth only'" Rework step (repeat for others)
    Then I see the "Adult or youth only" radio button below the defendant type help text
    Then I see the "Adult or youth with parent or guardian to pay" radio button below the "Adult or youth only" radio button
    Then I see the "Company" radio button below the "Adult or youth with parent or guardian to pay" radio button

    When I select the "Adult or youth only" radio button
    Then I validate the "Adult or youth only" radio button is selected
    And I validate the "Adult or youth with parent or guardian to pay" radio button is not selected
    And I validate the "Company" radio button is not selected

    When I select the "Adult or youth with parent or guardian to pay" radio button
    Then I validate the "Adult or youth with parent or guardian to pay" radio button is selected
    And I validate the "Adult or youth only" radio button is not selected
    And I validate the "Company" radio button is not selected

    When I select the "Company" radio button
    Then I validate the "Company" radio button is selected
    And I validate the "Adult or youth only" radio button is not selected
    And I validate the "Adult or youth with parent or guardian to pay" radio button is not selected

  Scenario: AC4 - no selections made - error message
    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard

    When I navigate to Manual Account Creation
    When I select the "Fine" radio button
    And I click the "Continue" button

    Then I see the error message "Enter a business unit" at the top of the page
    And I see the error message "Select a defendant type" at the top of the page
    And I see the error message "Enter a business unit" above the business unit field
    And I see the error message "Select a defendant type" above the "Adult or youth only" radio button


  Scenario: AC5 - Business unit selection made - no defendant type selection - error message
    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard

    When I navigate to Manual Account Creation

    And I enter "West London" into the business unit search box
    And I select the "Fine" radio button
    And I click the "Continue" button

    Then I see the error message "Select a defendant type" at the top of the page
    And I see the error message "Select a defendant type" above the "Adult or youth only" radio button

  Scenario: AC6 - Defendant type selection made - no business unit selection - error message
    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard

    When I navigate to Manual Account Creation

    When I select the "Fine" radio button
    And I select the "Adult or youth only" radio button
    And I click the "Continue" button

    Then I see the error message "Enter a business unit" at the top of the page
    And I see the error message "Enter a business unit" above the business unit field

  Scenario Outline: AC7,8,9 - Business unit and defendant type selections made - error message cleared
    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    And I am on the dashboard

    And I navigate to Manual Account Creation

    When I select the "Fine" radio button
    And I click the "Continue" button
    Then I see the error message "Enter a business unit" at the top of the page
    And I see the error message "Select a defendant type" at the top of the page
    And I see the error message "Enter a business unit" above the business unit field
    And I see the error message "Select a defendant type" above the "Adult or youth only" radio button

    When I enter "West London" into the business unit search box
    And I select the "<defendantType>" radio button
    And I click the "Continue" button
    Then I see the business unit is "West London"
    And I see the defendant type is "<defendantType>"

    Examples:
      | defendantType                                 |
      | Adult or youth only                           |
      | Adult or youth with parent or guardian to pay |
      | Company                                       |


  #Descoped --- this is not a valid scenario, user state should not be stored in this way
  # Scenario Outline: AC10,11,12 - Business unit and defendant type selections made - selections are stored when user navigates back
  #   Given I am on the OPAL Frontend
  #   When I see "Opal" in the header

  #   And I sign in as "opal-test@HMCTS.NET"
  #   And I am on the dashboard

  #   And I navigate to Manual Account Creation

  #   When I enter "West London" into the business unit search box
  #   And I select the "Fine" radio button
  #   And I select the "<defendantType>" radio button
  #   And I click the "Continue" button
  #   Then I see the business unit is "West London"
  #   And I see the defendant type is "<defendantType>"

  #   When I go back in the browser
  #   Then I see the value "West London" in the business unit search box
  #   And I validate the "<defendantType>" radio button is selected

  #   Examples:
  #     | defendantType                                 |
  #     | Adult or youth only                           |
  #     | Adult or youth with parent or guardian to pay |
  #     | Company                                       |

  Scenario: AC13 - Business unit and defendant type selections not made - user navigates back to dashboard
    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    And I am on the dashboard

    And I navigate to Manual Account Creation
    And I click on the "Cancel" link
    Then I am on the dashboard

  Scenario: AC14.a - Business unit and defendant type selections made - user navigates back to dashboard - clicks Ok
    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    And I am on the dashboard

    And I navigate to Manual Account Creation
    When I enter "West London" into the business unit search box
    And I select the "Fine" radio button
    And I select the "Adult or youth only" radio button
    And I click Cancel, a window pops up and I click Ok

    Then I am on the dashboard

  Scenario: AC14.b - Business unit and defendant type selections made - user navigates back to dashboard - clicks Cancel
    Given I am on the Opal Frontend and I sign in as "opal-test@hmcts.net"
    And I am on the dashboard

    And I navigate to Manual Account Creation
    When I enter "West London" into the business unit search box
    And I select the "Fine" radio button
    And I select the "Adult or youth only" radio button
    And I click Cancel, a window pops up and I click Cancel

    #Descoped by PO-426 --- Then I see "Create account" as the caption on the page
    And I see "Business unit and defendant type" on the page header
    And I see the value "West London" in the business unit search box
    And I validate the "Adult or youth only" radio button is selected
