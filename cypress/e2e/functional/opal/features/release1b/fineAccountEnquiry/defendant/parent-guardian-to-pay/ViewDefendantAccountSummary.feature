@JIRA-LABEL:account-enquiry
@JIRA-STORY:PO-777
Feature: Defendant - Parent or guardian to pay - View Defendant Account Summary - Add Comments

  Background:
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    And I clear all approved accounts
  @JIRA-EPIC:PO-812 @R1B @JIRA-STORY:PO-777 @JIRA-TEST-KEY:PO-5477
  Scenario: Complete View Defendant Adult or Youth with Parent Guardian to Pay Account Summary and Comments functionality
    # Create & publish a pgToPay account then view header summary
    Given I create a "pgToPay" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@dev.platform.hmcts.net":
      | Account_status                          | Submitted                             |
      | account.defendant.forenames             | Michael                               |
      | account.defendant.surname               | ParentGuardianSurname{uniq}           |
      | account.defendant.email_address_1       | Michael.ParentGuardian{uniq}@test.com |
      | account.defendant.telephone_number_home | 02078259318                           |
      | account.account_type                    | Fine                                  |
      | account.prosecutor_case_reference       | PCR-AUTO-007                          |
      | account.collection_order_made           | false                                 |
      | account.collection_order_made_today     | false                                 |
      | account.payment_card_request            | false                                 |
      | account.defendant.dob                   | 2010-05-15                            |

    When I search for the account by last name "ParentGuardianSurname{uniq}" and verify the page header is "Miss Michael PARENTGUARDIANSURNAME{uniqUpper}"

    # AC9a - Test route guard with unsaved changes
    When I verify route guard behaviour when cancelling comments with "Comment Test"
    Then I should see the account summary header contains "Miss Michael PARENTGUARDIANSURNAME{uniqUpper}"
    # AC2 / AC3 - Navigate to Add Comments and test form functionality for pgToPay account
    When I save the following comments and verify the account header is "Miss Michael PARENTGUARDIANSURNAME{uniqUpper}":
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

  @R1B @JIRA-STORY:PO-1112 @JIRA-EPIC:PO-812 @JIRA-TEST-KEY:PO-5478
  Scenario: As a user I can view account details of a Parent/Guardian account
    Given I create a "pgToPay" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@dev.platform.hmcts.net":
      | Account_status                          | Submitted                      |
      | account.defendant.forenames             | Catherine                      |
      | account.defendant.surname               | Green{uniq}                    |
      | account.defendant.email_address_1       | Catherine.Green{uniq}@test.com |
      | account.defendant.telephone_number_home | 02078217943                    |
      | account.account_type                    | Fine                           |
      | account.prosecutor_case_reference       | PCR-AUTO-008                   |
      | account.collection_order_made           | false                          |
      | account.collection_order_made_today     | false                          |
      | account.payment_card_request            | false                          |
      | account.defendant.dob                   | 2010-05-15                     |

    When I search for the account by last name "Green{uniq}" and verify the page header is "Miss Catherine GREEN{uniqUpper}"

    # AC4 - Route Guard
    When I verify route guard behaviour when cancelling Parent or guardian edits
    Then I should see the account summary header contains "Miss Catherine GREEN{uniqUpper}"
    # AC3 - Cancel Changes
    When I edit Parent or guardian details but cancel without saving
    Then I should see the account summary header contains "Miss Catherine GREEN{uniqUpper}"

    When I partially edit Parent or guardian details and choose to stay on the page
    Then I should see the unsaved value retained for Last name as "LNAMEALTERED"

    # When I discard Parent or guardian changes
    Then I should see the account summary header contains "Miss Catherine GREEN{uniqUpper}"
