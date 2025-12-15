@PO-777
Feature: View Defendant Account Summary - Add Comments

  Background:
    Given I am logged in with email "opal-test@HMCTS.NET"
    And I clear all approved draft accounts

  @PO-777
  Scenario: Complete View Defendant Account Adult or Youth Summary and Comments functionality
    # AC1 - Create → set Publishing Pending → search → open → verify header
    Given I create a "adultOrYouthOnly" draft account with the following details and set status "Publishing Pending":
      | Account_status                          | Submitted                      |
      | account.defendant.forenames             | John                           |
      | account.defendant.surname               | AccDetailSurname               |
      | account.defendant.email_address_1       | John.AccDetailSurname@test.com |
      | account.defendant.telephone_number_home | 02078259314                    |
      | account.account_type                    | Fine                           |
      | account.prosecutor_case_reference       | PCR-AUTO-002                   |
      | account.collection_order_made           | false                          |
      | account.collection_order_made_today     | false                          |
      | account.payment_card_request            | false                          |
      | account.defendant.dob                   | 2002-05-15                     |
    And I search for the account by last name "AccDetailSurname" and verify the page header is "Mr John ACCDETAILSURNAME"

    # AC2 / AC3 – Form checks
    When I open the Comments page from the defendant summary and verify the page contents
    And I cancel with confirmation on the Comments page
    Then I should see the account summary header contains "Mr John ACCDETAILSURNAME"

    # AC9a — route guard on Comments
    When I verify route guard behaviour when cancelling comments with "Comment Test"
    Then I should see the account summary header contains "Mr John ACCDETAILSURNAME"

    # AC5 – Verify updated comments on Defendant summary
    When I save the following comments and verify the account header is "Mr John ACCDETAILSURNAME":
      | field   | text         |
      | Comment | Comment Test |
      | Line 1  | Line1 Test   |
      | Line 2  | Line2 Test   |
      | Line 3  | Line3 Test   |

    # AC5c - Verify updated comments display for defendant
    Then Verify updated comments display in Comments section:
      | Comment | Comment Test |
      | Line 1  | Line1 Test   |
      | Line 2  | Line2 Test   |
      | Line 3  | Line3 Test   |

    Then I should see the following values on the Comments form:
      | Comment | Comment Test |
      | Line 1  | Line1 Test   |
      | Line 2  | Line2 Test   |
      | Line 3  | Line3 Test   |

  @PO-777
  Scenario: Complete View Defendant Company Account Summary and Comments functionality
    # AC4 - Create & publish a company account then view header summary
    Given I create a "company" draft account with the following details and set status "Publishing Pending":
      | Account_status                      | Submitted              |
      | account.defendant.company_name      | Accdetail comp         |
      | account.defendant.email_address_1   | Accdetailcomp@test.com |
      | account.defendant.post_code         | AB23 4RN               |
      | account.account_type                | Fine                   |
      | account.prosecutor_case_reference   | PCR-AUTO-003           |
      | account.collection_order_made       | false                  |
      | account.collection_order_made_today | false                  |
      | account.payment_card_request        | false                  |
    When I open the company account details for "Accdetail comp"

    # AC9a - Test route guard with unsaved changes
    # Test cancel with unsaved changes (route guard should trigger)
    When I verify route guard behaviour when cancelling comments with "Comment Test"
    Then I should see the account header contains "Accdetail comp"

    # AC5 – Verify updated comments on Defendant summary
    When I save the following comments and verify the account header is "Accdetail comp":
      | field   | text            |
      | Comment | Company Comment |
      | Line 1  | Company Line1   |
      | Line 2  | Company Line2   |
      | Line 3  | Company Line3   |

    # AC5c - Verify updated comments display for defendant
    Then Verify updated comments display in Comments section:
      | Comment | Company Comment |
      | Line 1  | Company Line1   |
      | Line 2  | Company Line2   |
      | Line 3  | Company Line3   |

    Then I should see the following values on the Comments form:
      | Comment | Company Comment |
      | Line 1  | Company Line1   |
      | Line 2  | Company Line2   |
      | Line 3  | Company Line3   |

  @PO-777
  Scenario: Complete View Defendant Adult or Youth with Parent Guardian to Pay Account Summary and Comments functionality
    # Create & publish a pgToPay account then view header summary
    Given I create a "pgToPay" draft account with the following details and set status "Publishing Pending":
      | Account_status                          | Submitted                       |
      | account.defendant.forenames             | Michael                         |
      | account.defendant.surname               | ParentGuardianSurname           |
      | account.defendant.email_address_1       | Michael.ParentGuardian@test.com |
      | account.defendant.telephone_number_home | 02078259318                     |
      | account.account_type                    | Fine                            |
      | account.prosecutor_case_reference       | PCR-AUTO-007                    |
      | account.collection_order_made           | false                           |
      | account.collection_order_made_today     | false                           |
      | account.payment_card_request            | false                           |
      | account.defendant.dob                   | 2010-05-15                      |

    When I search for the account by last name "ParentGuardianSurname" and verify the page header is "Miss Michael PARENTGUARDIANSURNAME"

    # AC9a - Test route guard with unsaved changes
    When I verify route guard behaviour when cancelling comments with "Comment Test"
    Then I should see the account summary header contains "Miss Michael PARENTGUARDIANSURNAME"

    # AC2 / AC3 - Navigate to Add Comments and test form functionality for pgToPay account
    When I save the following comments and verify the account header is "Miss Michael PARENTGUARDIANSURNAME":
      | field   | text                    |
      | Comment | Parent Guardian Comment |
      | Line 1  | Parent Guardian Line1   |
      | Line 2  | Parent Guardian Line2   |
      | Line 3  | Parent Guardian Line3   |

    #   # AC5c - Verify updated comments display for pgToPay account
    Then Verify updated comments display in Comments section:
      | Comment | Parent Guardian Comment |
      | Line 1  | Parent Guardian Line1   |
      | Line 2  | Parent Guardian Line2   |
      | Line 3  | Parent Guardian Line3   |

    Then I should see the following values on the Comments form:
      | Comment | Parent Guardian Comment |
      | Line 1  | Parent Guardian Line1   |
      | Line 2  | Parent Guardian Line2   |
      | Line 3  | Parent Guardian Line3   |

  @PO-1112
  Scenario: As a user I can view account details of a Parent/Guardian account
    Given I create a "pgToPay" draft account with the following details and set status "Publishing Pending":
      | Account_status                          | Submitted                |
      | account.defendant.forenames             | Catherine                |
      | account.defendant.surname               | Green                    |
      | account.defendant.email_address_1       | Catherine.Green@test.com |
      | account.defendant.telephone_number_home | 02078217943              |
      | account.account_type                    | Fine                     |
      | account.prosecutor_case_reference       | PCR-AUTO-008             |
      | account.collection_order_made           | false                    |
      | account.collection_order_made_today     | false                    |
      | account.payment_card_request            | false                    |
      | account.defendant.dob                   | 2010-05-15               |

    When I search for the account by last name "Green" and verify the page header is "Miss Catherine GREEN"

    # AC4 - Route Guard
    When I verify route guard behaviour when cancelling Parent or guardian edits
    Then I should see the account summary header contains "Miss Catherine GREEN"

    # AC3 - Cancel Changes
    When I edit Parent or guardian details but cancel without saving
    Then I should see the account summary header contains "Miss Catherine GREEN"

    When I partially edit Parent or guardian details and choose to stay on the page
    Then I should see the unsaved value retained for Last name as "LNAMEALTERED"

    # When I discard Parent or guardian changes
    Then I should see the account summary header contains "Miss Catherine GREEN"

