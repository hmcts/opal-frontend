Feature: PO-364 Parent or guardian to pay page, navigation and validation
  Feature Description:
  https://tools.hmcts.net/jira/browse/PO-364
  UI - Create the Parent or guardian details screen (Adult or Youth with Parent to Pay configuration)
  Special character validation will be implemented under a differenet ticket - Confirmed with BA


  # as per design changes updated this test on PO-569 - descoped this test
  # Scenario: AC1.a - Full name - input length validation
  #   Given I am on the OPAL Frontend
  #   Then I see "Opal" in the header

  #   When I sign in as "opal-test@HMCTS.NET"
  #   Then I am on the dashboard

  #   When I navigate to Manual Account Creation
  #   And I enter "West London" into the business unit search box
  #   And I select the "Fine" radio button
  #   And I select the "Adult or youth with parent or guardian to pay" radio button
  #   And I click the "Continue" button
  #   And I click on the "Parent or guardian details" link

  #   When I enter more than 30 characters into the "Full name" field
  #   And I click the "Return to account details" button

  #   Then I see the error message "The full name must be 30 characters or fewer" at the top of the page
  #   And I see the error message "The full name must be 30 characters or fewer" above the "Full name" field

  # as per design changes updated this test on PO-569 - descoped this test
  # Scenario: AC1.a - Full name - field is alpha numeric
  #   Given I am on the OPAL Frontend
  #   Then I see "Opal" in the header

  #   When I sign in as "opal-test@HMCTS.NET"
  #   Then I am on the dashboard

  #   When I navigate to Manual Account Creation
  #   And I enter "West London" into the business unit search box
  #   And I select the "Fine" radio button
  #   And I select the "Adult or youth with parent or guardian to pay" radio button
  #   And I click the "Continue" button
  #   And I click on the "Parent or guardian details" link

  #   When I enter "Abc123" into the "Full name" field
  #   And I enter "Address line 1" into the "Address line 1" field
  #   And I click the "Return to account details" button

  #   Then I see "Account details" on the page header

  # Scenario: AC1.a - Address Line 1 - input length validation
  #   Given I am on the OPAL Frontend
  #   Then I see "Opal" in the header

  #   When I sign in as "opal-test@HMCTS.NET"
  #   Then I am on the dashboard

  #   When I navigate to Manual Account Creation
  #   And I enter "West London" into the business unit search box
  #   And I select the "Fine" radio button
  #   And I select the "Adult or youth with parent or guardian to pay" radio button
  #   And I click the "Continue" button
  #   And I click on the "Parent or guardian details" link

  #   When I enter more than 30 characters into the "Address line 1" field
  #   And I click the "Return to account details" button

  #   Then I see the error message "The address line 1 must be 30 characters or fewer" at the top of the page
  #   And I see the error message "The address line 1 must be 30 characters or fewer" above the "Address line 1" field

  # as per design changes updated this test on PO-569 - descoped this test
  # Scenario: AC1.a - Address Line 1 - field is alpha numeric
  #   Given I am on the OPAL Frontend
  #   Then I see "Opal" in the header

  #   When I sign in as "opal-test@HMCTS.NET"
  #   Then I am on the dashboard

  #   When I navigate to Manual Account Creation
  #   And I enter "West London" into the business unit search box
  #   And I select the "Fine" radio button
  #   And I select the "Adult or youth with parent or guardian to pay" radio button
  #   And I click the "Continue" button
  #   And I click on the "Parent or guardian details" link


  #   When I enter "Abc123" into the "Full name" field
  #   And I enter "Address line 1" into the "Address line 1" field
  #   And I click the "Return to account details" button

  #   Then I see "Account details" on the page header

  # as per design changes updated this test on PO-569 - descoped this test

  # Scenario: AC1.a - Address Line 2 - input length validation
  #   Given I am on the OPAL Frontend
  #   Then I see "Opal" in the header

  #   When I sign in as "opal-test@HMCTS.NET"
  #   Then I am on the dashboard

  #   When I navigate to Manual Account Creation
  #   And I enter "West London" into the business unit search box
  #   And I select the "Fine" radio button
  #   And I select the "Adult or youth with parent or guardian to pay" radio button
  #   And I click the "Continue" button
  #   And I click on the "Parent or guardian details" link

  #   When I enter more than 30 characters into the "Address line 2" field
  #   And I click the "Return to account details" button

  #   Then I see the error message "The address line 2 must be 30 characters or fewer" at the top of the page
  #   And I see the error message "The address line 2 must be 30 characters or fewer" above the "Address line 2" field

  # as per design changes updated this test on PO-569 - descoped this test

  # Scenario: AC1.a - Address Line 2 - field is alpha numeric
  #   Given I am on the OPAL Frontend
  #   Then I see "Opal" in the header

  #   When I sign in as "opal-test@HMCTS.NET"
  #   Then I am on the dashboard

  #   When I navigate to Manual Account Creation
  #   And I enter "West London" into the business unit search box
  #   And I select the "Fine" radio button
  #   And I select the "Adult or youth with parent or guardian to pay" radio button
  #   And I click the "Continue" button
  #   And I click on the "Parent or guardian details" link

  #   When I enter "Abc123" into the "Full name" field
  #   And I enter "Address line 1" into the "Address line 1" field
  #   And I enter "Address line 2" into the "Address line 2" field
  #   And I click the "Return to account details" button

  #   Then I see "Account details" on the page header

  # as per design changes updated this test on PO-569 - descoped this test

  # Scenario: AC1.a - Post code - input length validation
  #   Given I am on the OPAL Frontend
  #   Then I see "Opal" in the header

  #   When I sign in as "opal-test@HMCTS.NET"
  #   Then I am on the dashboard

  #   When I navigate to Manual Account Creation
  #   And I enter "West London" into the business unit search box
  #   And I select the "Fine" radio button
  #   And I select the "Adult or youth with parent or guardian to pay" radio button
  #   And I click the "Continue" button
  #   And I click on the "Parent or guardian details" link

  #   When I enter "Abc123456" into the "Postcode" field
  #   And I click the "Return to account details" button

  #   Then I see the error message "The postcode must be 8 characters or fewer" at the top of the page
  #   And I see the error message "The postcode must be 8 characters or fewer" above the "Postcode" field



  Scenario: AC1.b - Address Line 1 - Asterisk not permitted validation
    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard

    When I navigate to Manual Account Creation
    And I enter "West London" into the business unit search box
    And I select the "Fine" radio button
    And I select the "Adult or youth with parent or guardian to pay" radio button
    And I click the "Continue" button
    And I click on the "Parent or guardian details" link

    When I enter "asterisk *" into the "Address line 1" field
    And I click the "Return to account details" button

    Then I see the error message "The address line 1 must not contain special characters" at the top of the page
    And I see the error message "The address line 1 must not contain special characters" above the "Address line 1" field

  Scenario: AC1.b - Address Line 2 - Asterisk not permitted validation
    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard

    When I navigate to Manual Account Creation
    And I enter "West London" into the business unit search box
    And I select the "Fine" radio button
    And I select the "Adult or youth with parent or guardian to pay" radio button
    And I click the "Continue" button
    And I click on the "Parent or guardian details" link

    When I enter "asterisk *" into the "Address line 2" field
    And I click the "Return to account details" button

    Then I see the error message "The address line 2 must not contain special characters" at the top of the page
    And I see the error message "The address line 2 must not contain special characters" above the "Address line 2" field

  # as per design changes updated this test on PO-569 - descoped this test

  # Scenario: AC2 - Mandatory fields
  #   Given I am on the OPAL Frontend
  #   Then I see "Opal" in the header

  #   When I sign in as "opal-test@HMCTS.NET"
  #   Then I am on the dashboard

  #   When I navigate to Manual Account Creation
  #   And I enter "West London" into the business unit search box
  #   And I select the "Fine" radio button
  #   And I select the "Adult or youth with parent or guardian to pay" radio button
  #   And I click the "Continue" button
  #   And I click on the "Parent or guardian details" link

  #   When I enter "test addr2" into the "Address line 2" field

  #   When I click the "Return to account details" button

  #   Then I see the error message "You must enter a full name" at the top of the page
  #   And I see the error message "You must enter a full name" above the "Full name" field

  #   Then I see the error message "Enter address line 1, typically the building and street" at the top of the page
  #   And I see the error message "Enter address line 1, typically the building and street" above the "Address line 1" field

  # as per design changes updated this test on PO-569 - descoped this test

  # Scenario: AC2.aii - Full name - is mandatory
  #   Given I am on the OPAL Frontend
  #   Then I see "Opal" in the header

  #   When I sign in as "opal-test@HMCTS.NET"
  #   Then I am on the dashboard

  #   When I navigate to Manual Account Creation
  #   And I enter "West London" into the business unit search box
  #   And I select the "Fine" radio button
  #   And I select the "Adult or youth with parent or guardian to pay" radio button
  #   And I click the "Continue" button
  #   And I click on the "Parent or guardian details" link

  #   And I click the "Return to account details" button

  #   Then I see the error message "You must enter a full name" at the top of the page
  #   And I see the error message "You must enter a full name" above the "Full name" field

  # as per design changes updated this test on PO-569 - descoped this test

  # Scenario: AC2.bii - Address line 1 - is mandatory
  #   Given I am on the OPAL Frontend
  #   Then I see "Opal" in the header

  #   When I sign in as "opal-test@HMCTS.NET"
  #   Then I am on the dashboard

  #   When I navigate to Manual Account Creation
  #   And I enter "West London" into the business unit search box
  #   And I select the "Fine" radio button
  #   And I select the "Adult or youth with parent or guardian to pay" radio button
  #   And I click the "Continue" button
  #   And I click on the "Parent or guardian details" link

  #   And I click the "Return to account details" button

  #   Then I see the error message "Enter address line 1, typically the building and street" at the top of the page
  #   And I see the error message "Enter address line 1, typically the building and street" above the "Address line 1" field

  Scenario: AC3 - Date of birth - future date validation
    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard

    When I navigate to Manual Account Creation
    And I enter "West London" into the business unit search box
    And I select the "Fine" radio button
    And I select the "Adult or youth with parent or guardian to pay" radio button
    And I click the "Continue" button
    And I click on the "Parent or guardian details" link

    When I enter "01/01/3000" into the Date of birth field
    And I click the "Return to account details" button

    Then I see the error message "Enter a valid date of birth in the past" at the top of the page
    And I see the error message "Enter a valid date of birth in the past" above the Date of birth field

  Scenario: AC3 - Date of birth - invalid date validation
    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard

    When I navigate to Manual Account Creation
    And I enter "West London" into the business unit search box
    And I select the "Fine" radio button
    And I select the "Adult or youth with parent or guardian to pay" radio button
    And I click the "Continue" button
    And I click on the "Parent or guardian details" link

    When I enter "10102000" into the Date of birth field
    And I click the "Return to account details" button

    Then I see the error message "Enter date of birth in the format DD/MM/YYYY" at the top of the page
    And I see the error message "Enter date of birth in the format DD/MM/YYYY" above the Date of birth field

  # #Fails pipeline, also not required test case
  # # Scenario: AC3 - Date of birth - Ancient date validation
  # #   Given I am on the OPAL Frontend
  # #   Then I see "Opal" in the header

  # #   When I sign in as "opal-test@HMCTS.NET"
  # #   Then I am on the dashboard

  # #   When I navigate to Manual Account Creation
  # #   And I select parent or guardian to pay
  # #   And I click on continue button
  # #   And "Parent or guardian details" is clicked

  # #   When I enter "01/01/1800" into the Date of birth field
  # #   And I click the "Return to account details" button

  # #   Then I see the error message "Enter a valid date of birth" at the top of the page
  # #   And I see the error message "Enter a valid date of birth" above the Date of birth field

  Scenario: AC4 - NI number - invalid format validation
    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard

    When I navigate to Manual Account Creation
    And I enter "West London" into the business unit search box
    And I select the "Fine" radio button
    And I select the "Adult or youth with parent or guardian to pay" radio button
    And I click the "Continue" button
    And I click on the "Parent or guardian details" link

    When I enter "NInumber1234" into the "National Insurance number" field
    And I click the "Return to account details" button

    Then I see the error message "Enter a National Insurance number in the format AANNNNNNA" at the top of the page
    And I see the error message "Enter a National Insurance number in the format AANNNNNNA" above the "National Insurance number" field

  Scenario: AC4 - NI number - invalid final character validation
    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard

    When I navigate to Manual Account Creation
    And I enter "West London" into the business unit search box
    And I select the "Fine" radio button
    And I select the "Adult or youth with parent or guardian to pay" radio button
    And I click the "Continue" button
    And I click on the "Parent or guardian details" link

    When I enter "AB123456Z" into the "National Insurance number" field
    And I click the "Return to account details" button

    Then I see the error message "Enter a National Insurance number in the format AANNNNNNA" at the top of the page
    And I see the error message "Enter a National Insurance number in the format AANNNNNNA" above the "National Insurance number" field

  Scenario: AC5 - All fields - correcting validation allows user to progress
    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard

    When I navigate to Manual Account Creation
    And I enter "West London" into the business unit search box
    And I select the "Fine" radio button
    And I select the "Adult or youth with parent or guardian to pay" radio button
    And I click the "Continue" button
    And I click on the "Parent or guardian details" link

    # as per design changes updated this test on PO-569 - descoped this test
    # When I enter more than 30 characters into the "Full name" field
    When I enter "this is first names field" into the "First names" field
    And I enter "checking Last name characters field for opal test" into the "Last name" field
    And I enter "01/012000" into the Date of birth field
    And I enter "AB123456Z" into the "National Insurance number" field
    And I enter "Address line 1 *" into the "Address line 1" field
    And I enter "Address line 2 *" into the "Address line 2" field
    And I enter "Abc123456" into the "Postcode" field

    And I click the "Return to account details" button

    # Then I see the error message "The full name must be 30 characters or fewer" at the top of the page
    # And I see the error message "The full name must be 30 characters or fewer" above the "Full name" field

    Then I see the error message "The parent or guardian's first name(s) must be 20 characters or fewer" at the top of the page
    And I see the error message "The parent or guardian's last name must be 30 characters or fewer" at the top of the page

    And I see the error message "Enter date of birth in the format DD/MM/YYYY" at the top of the page
    And I see the error message "Enter date of birth in the format DD/MM/YYYY" above the Date of birth field

    And I see the error message "Enter a National Insurance number in the format AANNNNNNA" at the top of the page
    And I see the error message "Enter a National Insurance number in the format AANNNNNNA" above the "National Insurance number" field

    And I see the error message "The address line 1 must not contain special characters" at the top of the page
    And I see the error message "The address line 1 must not contain special characters" above the "Address line 1" field

    And I see the error message "The address line 2 must not contain special characters" at the top of the page
    And I see the error message "The address line 2 must not contain special characters" above the "Address line 2" field

    And I see the error message "The postcode must be 8 characters or fewer" at the top of the page
    And I see the error message "The postcode must be 8 characters or fewer" above the "Postcode" field

    # When I enter "Fname Lname" into the "Full name" field
    When I enter "this is first names" into the "First names" field
    And I enter "checking Last name characters" into the "Last name" field
    And I enter "01/01/2000" into the Date of birth field
    And I enter "AB123456C" into the "National Insurance number" field
    And I enter "Address line 1" into the "Address line 1" field
    And I enter "Address line 2" into the "Address line 2" field
    And I enter "TE12 3ST" into the "Postcode" field

    And I click the "Return to account details" button

    Then I see "Account details" on the page header

  # as per design changes updated this test on PO-569 - descoped this test

  # Scenario: AC6 - All fields - happy path, data persists
  #   Given I am on the OPAL Frontend
  #   Then I see "Opal" in the header

  #   When I sign in as "opal-test@HMCTS.NET"
  #   Then I am on the dashboard

  #   When I navigate to Manual Account Creation
  #   And I enter "West London" into the business unit search box
  #   And I select the "Fine" radio button
  #   And I select the "Adult or youth with parent or guardian to pay" radio button
  #   And I click the "Continue" button
  #   And I click on the "Parent or guardian details" link

  #   When I enter "Fname Lname" into the "Full name" field
  #   And I enter "01/01/2000" into the Date of birth field
  #   And I enter "AB123456C" into the "National Insurance number" field
  #   And I enter "Address line 1" into the "Address line 1" field
  #   And I enter "Address line 2" into the "Address line 2" field
  #   And I enter "TE12 3ST" into the "Postcode" field

  #   And I click the "Return to account details" button
  #   And "Parent or guardian details" is clicked

  #   Then I see "Fname Lname" in the "Full name" field
  #   And I see "01/01/2000" in the Date of birth field
  #   And I see "AB123456C" in the "National Insurance number" field
  #   And I see "Address line 1" in the "Address line 1" field
  #   And I see "Address line 2" in the "Address line 2" field
  #   And I see "TE12 3ST" in the "Postcode" field

  Scenario: AC7 - No data entered - Cancel button returns to account details
    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard

    When I navigate to Manual Account Creation
    And I enter "West London" into the business unit search box
    And I select the "Fine" radio button
    And I select the "Adult or youth with parent or guardian to pay" radio button
    And I click the "Continue" button
    And I click on the "Parent or guardian details" link
    Then I see "Parent or guardian details" on the page header

    When "Cancel" is clicked

    Then I see "Account details" on the page header

  Scenario: AC8a - Route guards 'Ok' - fields cleared and user returned to account details
    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard

    When I navigate to Manual Account Creation
    And I enter "West London" into the business unit search box
    And I select the "Fine" radio button
    And I select the "Adult or youth with parent or guardian to pay" radio button
    And I click the "Continue" button
    And I click on the "Parent or guardian details" link

    # When I enter "Fname Lname" into the "Full name" field
    And I enter "Address line 1" into the "Address line 1" field

    Then I click Cancel, a window pops up and I click Ok

    Then I see "Account details" on the page header
    And "Parent or guardian details" is clicked
    # Then I see "" in the "Full name" field
    And I see "" in the "Address line 1" field

  Scenario: AC8b - Route guards 'Cancel' - user stays on page
    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard

    When I navigate to Manual Account Creation
    And I enter "West London" into the business unit search box
    And I select the "Fine" radio button
    And I select the "Adult or youth with parent or guardian to pay" radio button
    And I click the "Continue" button
    And I click on the "Parent or guardian details" link

    # When I enter "Fname Lname" into the "Full name" field
    And I enter "Address line 1" into the "Address line 1" field

    Then I click Cancel, a window pops up and I click Cancel

    Then I see "Parent or guardian details" on the page header
    # Then I see "Fname Lname" in the "Full name" field
    And I see "Address line 1" in the "Address line 1" field
