Feature: PO-530 Disabling and enabling of Payment Terms on Account details screen

  Background:
    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard
    When I navigate to Manual Account Creation

    #Descoped by PO-426 --- Then I see "Create account" as the caption on the page
    Then I see "Business unit and defendant type" on the page header
    And I enter "West London" into the business unit search box
    And I select the "Fine" radio button
    And I select the "Adult or youth only" radio button
    And I click the "Continue" button

    #Descoped by PO-426 --- Then I see "Create account" as the caption on the page
    Then I see "Account details" on the page header

  Scenario: AC1, AC2-  If the user has not completed Personal Details then payment terms link should not be enabled

    And I see the greyed out "Payment terms" under the "Offence and imposition details" section
    Then "Offence details" is verified as enabled
    Then "Payment terms" is verified as disabled
    And I see the status of "Payment terms" is "Cannot start yet"

  Scenario: AC3- positive When user has completed personal details section then payment terms link will be enabled
    Then I see the "Defendant details" section heading
    And I see the "Personal details" link under the "Defendant details" section
    And I click on the "Personal details" link
    Then I see "Personal details" on the page header
    When I select title "Mr" from dropdown
    And I enter "John Smithy Michael" into the "First names" field
    And I enter "Astridge Lamsden Langley Treen" into the "Last name" field
    And I enter "12 test road checking address1" into the "Address line 1" field
    Then I click the "Return to account details" button

    And I see the "Contact details" link under the "Defendant details" section
    Then "Payment terms" is verified as enabled
    Then I see the status of "Payment terms" is "Not provided"
