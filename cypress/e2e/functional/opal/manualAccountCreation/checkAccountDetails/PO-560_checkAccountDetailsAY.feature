Feature: PO-663 - Check account details - Company

  Background:
    Given I am on the OPAL Frontend
    When I see "Opal" in the header

    Given I am on the Opal Frontend and I sign in as "opal-test-7@hmcts.net"
    And I am on the dashboard
    And I navigate to Manual Account Creation

    And I see "Business unit and defendant type" on the page header
    And I select the "Fine" radio button
    And I select the "Company" radio button
    And I click the "Continue" button
    And I see "Account details" on the page header

  Scenario: AC1,2,3,4,5 - Check account details - Company
    ### Check the button is not displayed when no data has been entered
    Given I see "Account details" on the page header
    And I see the status of "Court details" is "Not provided"
    And I see the status of "Company details" is "Not provided"
    And I see the status of "Contact details" is "Not provided"
    And I see the status of "Offence details" is "Not provided"
    And I see the status of "Payment terms" is "Not provided"
    And I see the status of "Account comments and notes" is "Not provided"
    And I see the "Check and submit for review" section heading
    And I see "Check that all required fields have been entered before you submit for review" text on the page
    And the button with text "Review account" should not be present

    ### Court Details
    When I click on the "Court details" link
    And I see "Court details" on the page header
    And I enter "Central London Magistrates' Court (2570)" into the "Sending area or Local Justice Area (LJA)" search box
    And I enter "AC123NMJT" into the "Prosecutor Case Reference (PCR)" field
    And I enter "ACTON (820)" into the "Enforcement court" search box

    When I click the "Return to account details" button
    Then I see "Account details" on the page header
    And I see the status of "Court details" is "Provided"
    And I see "Check that all required fields have been entered before you submit for review" text on the page
    And the button with text "Review account" should not be present

    ### Company Details
    When I click on the "Company details" link
    And I see "Company details" on the page header
    And I enter "CNAME" into the "Company name" field
    And I enter "ADDR1" into the "Address line 1" field

    When I click the "Return to account details" button
    Then I see "Account details" on the page header
    And I see the status of "Company details" is "Provided"
    And I see "Check that all required fields have been entered before you submit for review" text on the page
    And the button with text "Review account" should not be present

    ### Offence Details
    When I click on the "Offence details" link
    And I see "Add an offence" on the page header

    Then I enter "TP11003" into the "Offence code" field
    And I enter a date 9 weeks into the past into the "Date of sentence" date field

    Then I enter "Fine (FO)" into the "Result code" field for imposition 1
    And I enter "200" into the "Amount imposed" field for imposition 1
    And I enter "50" into the "Amount paid" field for imposition 1

    Then I click the "Review offence" button
    And I see "Offences and impositions" on the page header

    Then I click the "Return to account details" button
    And I see "Account details" on the page header
    And I see the status of "Offence details" is "Provided"
    And I see the status of "Payment terms" is "Not provided"
    And the button with text "Review account" should not be present

    ### Payment Terms
    When I click on the "Payment terms" link
    And I see "Payment terms" on the page header
    And I select the "Pay in full" radio button
    And I enter a date 28 weeks into the future into the "Enter pay by date" date field

    ### Button is now enabled
    When I click the "Return to account details" button
    Then I see "Account details" on the page header
    And I see the status of "Payment terms" is "Provided"
    And I see the "Review account" button
    And I do not see "Check that all required fields have been entered before you submit for review" text on the page

    ### Click the button
    When I click the "Review account" button
    Then I see "Check account details" on the page header

    ### Account details table
    Then I see the "Business unit" is "Gwent" in the account details table
    And I see the "Account type" is "Fine" in the account details table
    And I see the "Defendant type" is "Company" in the account details table
    And I see the "Document language" is "Welsh and English" in the account details table
    And I see the "Court hearing language" is "Welsh and English" in the account details table

    ### Court details table
    Then I see the following in the "Court details" table:
      # | Sending area or Local Justice Area (LJA) | Central London Magistrates' Court (2570) |
      | Prosecutor Case Reference (PCR) | AC123NMJT   |
      | Enforcement court               | ACTON (820) |

    ### Company details table
    Then I see the following in the "Company details" table:
      | Company name | CNAME |
      | Aliases      | —     |
      | Address      | ADDR1 |

    ### Contact details table
    Then I see the following in the "Contact details" table:
      | Primary email address   | — |
      | Secondary email address | — |
      | Mobile telephone number | — |
      | Home telephone number   | — |
      | Work telephone number   | — |

    ### Offence and imposition details table - only checking offence code as rest of table is tested extensively under offence details tests
    Then I see the following in the "Offences and impositions" table:
      | Offence code | TP11003 |

    ### Payment terms table
    Then I see the following in the "Payment terms" table:
      | Payment terms      | Pay in full |
      | Pay by date        | 28 weeks    |
      | Enforcement action | No          |

    ### Account comments and notes table
    Then I see the following in the "Account comments and notes" table:
      | Comment      | — |
      | Account note | — |


    And I do not see the "Personal details" table
    And I do not see the "Parent or guardian details" table
    And I do not see the "Employer details" table

    ### Change link
    When I click on the "Change" link in the "Company details" table
    Then I see "Account details" on the page header
    Then I click the "Review account" button

    ### Submit for review - not yet implemented.
    # When I click the "Submit for review" button
    #Then I see "Account submitted for review" on the page header
    #And I click on the "Back" link

    ### Delete account link
    Then I click on the "Delete account" link
    Then I see "Are you sure you want to delete this account?" on the page header

    When I click on the "No - cancel" link
    Then I see "Check account details" on the page header
    And I see the following in the "Court details" table:
      #| Sending area or Local Justice Area (LJA) | Central London Magistrates' Court (2570) |
      | Prosecutor Case Reference (PCR) | AC123NMJT   |
      | Enforcement court               | ACTON (820) |

    When I click on the "Delete account" link
    Then I see "Are you sure you want to delete this account?" on the page header

    When I click the "Yes - delete" button
    Then I see "Business unit and defendant type" on the page header
    And I see "The account will be created in Gwent" above the "Account type" heading



