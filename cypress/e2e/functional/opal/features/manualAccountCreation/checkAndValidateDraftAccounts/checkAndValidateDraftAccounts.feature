@UAT-Technical
Feature: Check and Validate - Checker

  Background:
    Given I am logged in with email "opal-test@HMCTS.NET"
    Then I should be on the dashboard

  @PO-594
  Scenario: Back navigation returns to Review accounts from an in-review draft
    Given a "adultOrYouthOnly" draft account exists with:
      | Account_status                          | Submitted                       |
      | account.defendant.forenames             | Larry                           |
      | account.defendant.surname               | Lincoln{uniq}                   |
      | account.defendant.email_address_1       | larry.lincoln{uniq}@outlook.com |
      | account.defendant.telephone_number_home | 02078219385                     |
    And I am logged in with email "opal-test-10@HMCTS.NET"
    When I open Check and Validate Draft Accounts
    Then I open the draft account for "LINCOLN{uniqUpper}, Larry" and see header "Mr Larry LINCOLN{uniqUpper}"
    And the draft account status tag is "In review"
    When I go back to Check and Validate Draft Accounts
    Then I should see the checker header "Review accounts" and status heading "To review"

  @PO-594
  Scenario: Approve an in-review draft account from the review screen
    Given a "adultOrYouthOnly" draft account exists with:
      | Account_status                                            | Submitted                                                                                                                                                                                              |
      | account.defendant.forenames                               | Larry                                                                                                                                                                                                  |
      | account.defendant.surname                                 | Lincoln{uniq}                                                                                                                                                                                          |
      | account.defendant.email_address_1                         | larry.lincoln{uniq}@outlook.com                                                                                                                                                                        |
      | account.defendant.telephone_number_home                   | 02078219385                                                                                                                                                                                            |
      | account.defendant.debtor_detail.vehicle_make              | _=+[{]};:'@#~,<.>/?\\\\\|¬`!"£                                                                                                                                                                         |
      | account.defendant.debtor_detail.vehicle_registration_mark | $%^&*()-                                                                                                                                                                                               |
      | account.account_notes                                     | [{"account_note_serial":1,"account_note_text":"It's a comment - includes a dash.","note_type":"AC"},{"account_note_serial":2,"account_note_text":"Here's a note - includes a dash.","note_type":"AA"}] |
    And I am logged in with email "opal-test-10@HMCTS.NET"
    When I open Check and Validate Draft Accounts
    Then I open the draft account for "Lincoln{uniq}, Larry" and see header "Mr Larry Lincoln{uniq}"
    And the draft account status tag is "In review"
    When I record the following decision on the draft account:
      | Decision | Approve |
    Then I should see the checker header "Review accounts" and status heading "To review"
    And the draft success banner is "You have approved Larry Lincoln{uniq}'s account"

  @PO-969 @PO-601
  Scenario: Reject an in-review draft account and review it from the Rejected tab
    Given a "adultOrYouthOnly" draft account exists with:
      | Account_status                          | Submitted                      |
      | account.defendant.forenames             | Harry                          |
      | account.defendant.surname               | Potter{uniq}                   |
      | account.defendant.email_address_1       | harry.potter{uniq}@outlook.com |
      | account.defendant.telephone_number_home | 02078219385                    |
    And I am logged in with email "opal-test-10@HMCTS.NET"
    When I open Check and Validate Draft Accounts
    Then I open the draft account for "Potter{uniq}, Harry" and see header "Mr Harry Potter{uniq}"
    And the draft account status tag is "In review"
    When I record the following decision on the draft account:
      | Decision | Reject                 |
      | Reason   | Testing review history |
    Then I should see the checker header "Review accounts" and status heading "To review"
    And the draft success banner is "You have rejected Harry Potter{uniq}'s account"
    When I view the "Rejected" tab on the Check and Validate page
    Then I open the draft account for "Potter{uniq}, Harry" and see header "Mr Harry Potter{uniq}"
    And the draft account status tag is "Rejected"
    When I go back to Check and Validate Draft Accounts
    Then I should see the checker header "Review accounts" and status heading "Rejected"

  @PO-597 @PO-616
  Scenario: Delete an in-review draft account and verify it on the Deleted tab
    Given a "adultOrYouthOnly" draft account exists with:
      | Account_status                          | Submitted                    |
      | account.defendant.forenames             | Peter                        |
      | account.defendant.surname               | Barnes{uniq}                 |
      | account.defendant.email_address_1       | peter.barn{uniq}@outlook.com |
      | account.defendant.telephone_number_home | 02078219334                  |
    And I am logged in with email "opal-test-10@HMCTS.NET"
    When I open Check and Validate Draft Accounts
    Then I open the draft account for "Barnes{uniq}, Peter" and see header "Mr Peter Barnes{uniq}"
    And the draft account status tag is "In review"
    When I delete the draft account from review and see the confirmation page
    And I confirm draft deletion with reason:
      | Reason | test reason YXZ123 |
    Then I should see the checker header "Review accounts" and status heading "To review"
    And the draft success banner is "You have deleted Barnes{uniq}, Peter's account"
    When I view the "Deleted" tab on the Check and Validate page
    Then I open the draft account for "Barnes{uniq}, Peter" and see header "Mr Peter Barnes{uniq}"
    And the draft account status tag is "Deleted"
    And the draft review history item 1 is:
      | title       | Deleted            |
      | description | test reason YXZ123 |
    When I go back to Check and Validate Draft Accounts
    Then I should see the checker header "Review accounts" and status heading "Deleted"

  @PO-597
  Scenario: Cancel draft deletion and remain on the confirmation page
    Given a "adultOrYouthOnly" draft account exists with:
      | Account_status                          | Submitted                    |
      | account.defendant.forenames             | Peter                        |
      | account.defendant.surname               | Barn{uniq}                   |
      | account.defendant.email_address_1       | peter.barn{uniq}@outlook.com |
      | account.defendant.telephone_number_home | 02078219334                  |
    And I am logged in with email "opal-test-10@HMCTS.NET"
    When I open Check and Validate Draft Accounts
    Then I open the draft account for "BARN{uniqUpper}, Peter" and see header "Mr Peter BARN{uniqUpper}"
    When I delete the draft account from review and see the confirmation page
    And I cancel draft deletion choosing "No - Cancel"
    Then I should be back on the page "Mr Peter BARN{uniqUpper}" with status "In review"

  @PO-597
  Scenario: Cancel draft deletion after entering a reason and return to the account
    Given a "adultOrYouthOnly" draft account exists with:
      | Account_status                          | Submitted                    |
      | account.defendant.forenames             | Peter                        |
      | account.defendant.surname               | Barn{uniq}                   |
      | account.defendant.email_address_1       | peter.barn{uniq}@outlook.com |
      | account.defendant.telephone_number_home | 02078219334                  |
    And I am logged in with email "opal-test-10@HMCTS.NET"
    When I open Check and Validate Draft Accounts
    Then I open the draft account for "BARN{uniqUpper}, Peter" and see header "Mr Peter BARN{uniqUpper}"
    When I delete the draft account from review and see the confirmation page
    And I provide the draft deletion reason:
      | Reason | test reason |
    When I cancel draft deletion choosing "No - Cancel"
    Then I should be on the draft delete confirmation page
    When I cancel draft deletion choosing "Ok"
    Then I should see the header containing text "Mr Peter BARN{uniqUpper}"

  @PO-968
  Scenario: Show a global error banner when approving fails
    Given a "adultOrYouthOnly" draft account exists with:
      | Account_status                          | Submitted                    |
      | account.defendant.forenames             | Paul                         |
      | account.defendant.surname               | BLART{uniq}                  |
      | account.defendant.email_address_1       | paul.blart{uniq}@outlook.com |
      | account.defendant.telephone_number_home | 02078219385                  |
    And I am logged in with email "opal-test-10@HMCTS.NET"
    And draft account decision updates fail with status 400
    When I open Check and Validate Draft Accounts
    Then I open the draft account for "BLART{uniqUpper}, Paul" and see header "Mr Paul BLART{uniqUpper}"
    And the draft account status tag is "In review"
    When I record the following decision on the draft account:
      | Decision | Approve |
    Then I should see the draft global error banner

  @PO-1073
  Scenario: View a failed draft account and return to the Failed tab
    Given failed draft accounts are stubbed with one result
    When I open Check and Validate Draft Accounts
    And I see the following text "Failed 1"
    When I view the "Failed" tab on the Check and Validate page
    Then the checker status heading is "Failed"
    Then I open the draft account for "GREEN, Oliver" and see header "Mr Oliver GREEN"
    When I go back to Check and Validate Draft Accounts
    Then I should see the checker header "Review accounts" and status heading "Failed"

  @PO-603
  Scenario: Open an existing deleted draft account from the Deleted tab
    Given a "adultOrYouthOnly" draft account exists with:
      | Account_status                          | Submitted                   |
      | account.defendant.forenames             | Paul                        |
      | account.defendant.surname               | Salt{uniq}                  |
      | account.defendant.email_address_1       | paul.salt{uniq}@outlook.com |
      | account.defendant.telephone_number_home | 02038219385                 |
    And I am logged in with email "opal-test-10@HMCTS.NET"
    And I set the last created draft account status to "Deleted"
    When I open Check and Validate Draft Accounts
    And I view the "Deleted" tab on the Check and Validate page
    Then the checker status heading is "Deleted"
    Then I open the draft account for "SALT{uniqUpper}, Paul" and see header "Mr Paul SALT{uniqUpper}"
    And the draft account status tag is "Deleted"
    When I go back to Check and Validate Draft Accounts
    Then I should see the header containing text "Review accounts"

  @PO-1804
  Scenario: Open a fixed penalty account from the To review tab and return using Back
    Given a "fixedPenalty" draft account exists with:
      | Account_status              | Submitted      |
      | account.defendant.forenames | FakeFixed      |
      | account.defendant.surname   | FAKELAST{uniq} |
    And I am logged in with email "opal-test-10@HMCTS.NET"
    When I open Check and Validate Draft Accounts
    Then I open the draft account for "FAKELAST{uniqUpper}, FakeFixed" and see header "Mr FakeFixed FAKELAST{uniqUpper}"
    When I go back to Check and Validate Draft Accounts
    Then I should see the header containing text "Review accounts"

  @PO-1804
  Scenario: Open a fixed penalty company account from the To review tab and return using Back
    Given a "fixedPenaltyCompany" draft account exists with:
      | Account_status                 | Submitted                      |
      | account.defendant.company_name | TestFixedPenaltyCompany {uniq} |
    And I am logged in with email "opal-test-10@HMCTS.NET"
    When I open Check and Validate Draft Accounts
    Then I open the draft account for "TestFixedPenaltyCompany {uniq}" and see header "TestFixedPenaltyCompany {uniq}"
    When I go back to Check and Validate Draft Accounts
    Then I should see the header containing text "Review accounts"


  @PO-2463
  Scenario: Delete a fixed penalty company draft and return from the Deleted tab
    Given a "fixedPenaltyCompany" draft account exists with:
      | Account_status                 | Submitted                      |
      | account.defendant.company_name | TestFixedPenaltyCompany {uniq} |
    And I am logged in with email "opal-test-10@HMCTS.NET"
    When I open Check and Validate Draft Accounts
    Then I open the draft account for "TestFixedPenaltyCompany {uniq}" and see header "TestFixedPenaltyCompany {uniq}"
    When I delete the draft account from review and see the confirmation page
    When I confirm draft deletion with reason:
      | Reason | test reason YXZ123 |
    Then I should see the checker header "Review accounts" and status heading "To review"
    When I view the "Deleted" tab on the Check and Validate page
    Then I open the draft account for "TestFixedPenaltyCompany {uniq}" and see header "TestFixedPenaltyCompany {uniq}"
    And the draft account status tag is "Deleted"
    When I go back to Check and Validate Draft Accounts
    Then I should see the checker header "Review accounts" and status heading "Deleted"


  @PO-2463
  Scenario: Delete a fixed penalty draft and return from the Deleted tab
    Given a "fixedPenalty" draft account exists with:
      | Account_status              | Submitted      |
      | account.defendant.forenames | FakeFixed      |
      | account.defendant.surname   | FAKELAST{uniq} |
    And I am logged in with email "opal-test-10@HMCTS.NET"
    When I open Check and Validate Draft Accounts
    Then I open the draft account for "FAKELAST{uniqUpper}, FakeFixed" and see header "Mr FakeFixed FAKELAST{uniqUpper}"
    When I delete the draft account from review and see the confirmation page
    When I confirm draft deletion with reason:
      | Reason | test reason YXZ123 |
    Then I should see the checker header "Review accounts" and status heading "To review"
    When I view the "Deleted" tab on the Check and Validate page
    Then I open the draft account for "FAKELAST{uniqUpper}, FakeFixed" and see header "Mr FakeFixed FAKELAST{uniqUpper}"
    And the draft account status tag is "Deleted"
    When I go back to Check and Validate Draft Accounts
    Then I should see the checker header "Review accounts" and status heading "Deleted"

  @PO-2463
  Scenario: Reject a fixed penalty draft and return from the Rejected tab
    Given a "fixedPenalty" draft account exists with:
      | Account_status              | Submitted      |
      | account.defendant.forenames | FakeFixed      |
      | account.defendant.surname   | FAKELAST{uniq} |
    And I am logged in with email "opal-test-10@HMCTS.NET"
    When I open Check and Validate Draft Accounts
    Then I open the draft account for "FAKELAST{uniqUpper}, FakeFixed" and see header "Mr FakeFixed FAKELAST{uniqUpper}"
    And the draft account status tag is "In review"
    When I record the following decision on the draft account:
      | Decision | Reject                 |
      | Reason   | Testing review history |
    Then I should see the checker header "Review accounts" and status heading "To review"
    When I view the "Rejected" tab on the Check and Validate page
    Then I open the draft account for "FAKELAST{uniqUpper}, FakeFixed" and see header "Mr FakeFixed FAKELAST{uniqUpper}"
    And the draft account status tag is "Rejected"
    When I go back to Check and Validate Draft Accounts
    Then I should see the header containing text "Review accounts"

  @PO-2463
  Scenario: Reject a fixed penalty company draft and return from the Rejected tab
    Given a "fixedPenaltyCompany" draft account exists with:
      | Account_status                 | Submitted                      |
      | account.defendant.company_name | TestFixedPenaltyCompany {uniq} |
    And I am logged in with email "opal-test-10@HMCTS.NET"
    When I open Check and Validate Draft Accounts
    Then I open the draft account for "TestFixedPenaltyCompany {uniq}" and see header "TestFixedPenaltyCompany {uniq}"
    And the draft account status tag is "In review"
    When I record the following decision on the draft account:
      | Decision | Reject                 |
      | Reason   | Testing review history |
    Then I should see the checker header "Review accounts" and status heading "To review"
    When I view the "Rejected" tab on the Check and Validate page
    Then I open the draft account for "TestFixedPenaltyCompany {uniq}" and see header "TestFixedPenaltyCompany {uniq}"
    And the draft account status tag is "Rejected"
    When I go back to Check and Validate Draft Accounts
    Then I should see the header containing text "Review accounts"
