Feature: Manual Account Creation - Accessibility
  Scenario Outline: Manual account creation - Accessibility - user 1 BU
    Given I am on the OPAL Frontend
    When I sign in as "opal-test-3@hmcts.net"
    When I navigate to "<url>" URL
    And I see "<header>" on the page header

    Then I check accessibility

    Then I click the Sign out link

    Examples:
      | page          | header                           | url                                           |
      | createAccount | Business unit and defendant type | /fines/manual-account-creation/create-account |



  # Scenario Outline: Manual account creation - Accessibility
  #   Given I am on the OPAL Frontend
  #   When I sign in as "opal-test@hmcts.net"
  #   When I navigate to "<url>" URL
  #   And I see "<header>" on the page header
  #   Then I check accessibility

  #   Then I click the Sign out link

  #   Examples:
  #     | page                  | header                           | url                                                    |
  #     | createAccount         | Business unit and defendant type | /fines/manual-account-creation/create-account          |
  #     | taskList              | Account details                  | /fines/manual-account-creation/account-details         |
  #     | courtDetails          | Court details                    | /fines/manual-account-creation/court-details           |
  #     | companyDetails        | Company details                  | /fines/manual-account-creation/company-details         |
  #     | parentGuardianDetails | Parent or guardian details       | /fines/manual-account-creation/parent-guardian-details |
  #     | personalDetails       | Personal details                 | /fines/manual-account-creation/personal-details        |
  #     | contactDetails        | Contact details                  | /fines/manual-account-creation/contact-details         |
  #     | employerDetails       | Employer details                 | /fines/manual-account-creation/employer-details        |
  #     | offenceDetails        | Offence details                  | /fines/manual-account-creation/offence-details         |
  #     #| paymentTerms          | Payment terms                    | /fines/manual-account-creation/payment-terms           |
  #     | accountCommentsNotes  | Account comments and notes       | /fines/manual-account-creation/account-comments-notes  |



  Scenario Outline: Manual account creation - Accessibility
    Given I am on the OPAL Frontend
    When I sign in as "opal-test@hmcts.net"
    Then I navigate to each URL in the datatable and check accessibility
      | page                  | header                           | url                                                    |
      | createAccount         | Business unit and defendant type | /fines/manual-account-creation/create-account          |
      | taskList              | Account details                  | /fines/manual-account-creation/account-details         |
      | courtDetails          | Court details                    | /fines/manual-account-creation/court-details           |
      | companyDetails        | Company details                  | /fines/manual-account-creation/company-details         |
      | parentGuardianDetails | Parent or guardian details       | /fines/manual-account-creation/parent-guardian-details |
      | personalDetails       | Personal details                 | /fines/manual-account-creation/personal-details        |
      | contactDetails        | Contact details                  | /fines/manual-account-creation/contact-details         |
      | employerDetails       | Employer details                 | /fines/manual-account-creation/employer-details        |
      | offenceDetails        | Offence details                  | /fines/manual-account-creation/offence-details         |
      #| paymentTerms          | Payment terms                    | /fines/manual-account-creation/payment-terms           |
      | accountCommentsNotes  | Account comments and notes       | /fines/manual-account-creation/account-comments-notes  |
    Then I click the Sign out link
