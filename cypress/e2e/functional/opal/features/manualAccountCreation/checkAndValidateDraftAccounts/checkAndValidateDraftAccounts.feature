Feature: Check and Validate - Checker

  Background:
    Given I am logged in with email "opal-test@HMCTS.NET"
    Then I should be on the dashboard

  @PO-594
  Scenario: Back navigation returns to Review accounts from an in-review draft
    Given a "adultOrYouthOnly" draft account exists with:
      | Account_status                          | Submitted                 |
      | account.defendant.forenames             | Larry                     |
      | account.defendant.surname               | Lincoln                   |
      | account.defendant.email_address_1       | larry.lincoln@outlook.com |
      | account.defendant.telephone_number_home | 02078219385               |
    And I am logged in with email "opal-test-10@HMCTS.NET"
    When I open Check and Validate Draft Accounts
    Then I open the draft account for "Lincoln, Larry" and see header "Mr Larry LINCOLN"
    And the draft account status tag is "In review"
    When I go back to Check and Validate Draft Accounts
    Then I should see the checker header "Review accounts" and status heading "To review"

  @PO-594
  Scenario: Approve an in-review draft account from the review screen
    Given a "adultOrYouthOnly" draft account exists with:
      | Account_status                          | Submitted                 |
      | account.defendant.forenames             | Larry                     |
      | account.defendant.surname               | Lincoln                   |
      | account.defendant.email_address_1       | larry.lincoln@outlook.com |
      | account.defendant.telephone_number_home | 02078219385               |
    And I am logged in with email "opal-test-10@HMCTS.NET"
    When I open Check and Validate Draft Accounts
    Then I open the draft account for "Lincoln, Larry" and see header "Mr Larry LINCOLN"
    And the draft account status tag is "In review"
    When I record the following decision on the draft account:
      | Decision | Approve |
    Then I should see the checker header "Review accounts" and status heading "To review"
    And the draft success banner is "You have approved Larry Lincoln's account"

  @PO-969 @PO-601
  Scenario: Reject an in-review draft account and review it from the Rejected tab
    Given a "adultOrYouthOnly" draft account exists with:
      | Account_status                          | Submitted                |
      | account.defendant.forenames             | Harry                    |
      | account.defendant.surname               | Potter                   |
      | account.defendant.email_address_1       | harry.potter@outlook.com |
      | account.defendant.telephone_number_home | 02078219385              |
    And I am logged in with email "opal-test-10@HMCTS.NET"
    When I open Check and Validate Draft Accounts
    Then I open the draft account for "Potter, Harry" and see header "Mr Harry POTTER"
    And the draft account status tag is "In review"
    When I record the following decision on the draft account:
      | Decision | Reject                 |
      | Reason   | Testing review history |
    Then I should see the checker header "Review accounts" and status heading "To review"
    And the draft success banner is "You have rejected Harry Potter's account"
    When I view the "Rejected" tab on the Check and Validate page
    Then I open the draft account for "Potter, Harry" and see header "Mr Harry POTTER"
    And the draft account status tag is "Rejected"
    When I go back to Check and Validate Draft Accounts
    Then I should see the checker header "Review accounts" and status heading "Rejected"

  @PO-597 @PO-616
  Scenario: Delete an in-review draft account and verify it on the Deleted tab
    Given a "adultOrYouthOnly" draft account exists with:
      | Account_status                          | Submitted              |
      | account.defendant.forenames             | Peter                  |
      | account.defendant.surname               | BARNES                 |
      | account.defendant.email_address_1       | peter.barn@outlook.com |
      | account.defendant.telephone_number_home | 02078219334            |
    And I am logged in with email "opal-test-10@HMCTS.NET"
    When I open Check and Validate Draft Accounts
    Then I open the draft account for "BARNES, Peter" and see header "Mr Peter BARNES"
    And the draft account status tag is "In review"
    When I delete the draft account from review and see the confirmation page
    And I confirm draft deletion with reason:
      | Reason | test reason YXZ123 |
    Then I should see the checker header "Review accounts" and status heading "To review"
    And the draft success banner is "You have deleted BARNES, Peter's account"
    When I view the "Deleted" tab on the Check and Validate page
    Then I open the draft account for "BARNES, Peter" and see header "Mr Peter BARNES"
    And the draft account status tag is "Deleted"
    And the draft review history item 1 is:
      | title       | Deleted            |
      | description | test reason YXZ123 |
    When I go back to Check and Validate Draft Accounts
    Then I should see the checker header "Review accounts" and status heading "Deleted"

  @PO-597
  Scenario: Cancel draft deletion and remain on the confirmation page
    Given a "adultOrYouthOnly" draft account exists with:
      | Account_status                          | Submitted              |
      | account.defendant.forenames             | Peter                  |
      | account.defendant.surname               | Barn                   |
      | account.defendant.email_address_1       | peter.barn@outlook.com |
      | account.defendant.telephone_number_home | 02078219334            |
    And I am logged in with email "opal-test-10@HMCTS.NET"
    When I open Check and Validate Draft Accounts
    Then I open the draft account for "Barn, Peter" and see header "Mr Peter BARN"
    When I delete the draft account from review and see the confirmation page
    And I cancel draft deletion choosing "No - Cancel"
    Then I should be back on the page "Mr Peter BARN" with status "In review"

  @PO-597
  Scenario: Cancel draft deletion after entering a reason and return to the account
    Given a "adultOrYouthOnly" draft account exists with:
      | Account_status                          | Submitted              |
      | account.defendant.forenames             | Peter                  |
      | account.defendant.surname               | Barn                   |
      | account.defendant.email_address_1       | peter.barn@outlook.com |
      | account.defendant.telephone_number_home | 02078219334            |
    And I am logged in with email "opal-test-10@HMCTS.NET"
    When I open Check and Validate Draft Accounts
    Then I open the draft account for "Barn, Peter" and see header "Mr Peter BARN"
    When I delete the draft account from review and see the confirmation page
    And I provide the draft deletion reason:
      | Reason | test reason |
    When I cancel draft deletion choosing "No - Cancel"
    Then I should be on the draft delete confirmation page
    When I cancel draft deletion choosing "Ok"
    Then I should see the header containing text "Mr Peter BARN"

  @PO-968
  Scenario: Show a global error banner when approving fails
    Given a "adultOrYouthOnly" draft account exists with:
      | Account_status                          | Submitted              |
      | account.defendant.forenames             | Paul                   |
      | account.defendant.surname               | BLART                  |
      | account.defendant.email_address_1       | paul.blart@outlook.com |
      | account.defendant.telephone_number_home | 02078219385            |
    And I am logged in with email "opal-test-10@HMCTS.NET"
    And draft account decision updates fail with status 400
    When I open Check and Validate Draft Accounts
    Then I open the draft account for "BLART, Paul" and see header "Mr Paul BLART"
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
      | Account_status                          | Submitted             |
      | account.defendant.forenames             | Paul                  |
      | account.defendant.surname               | Salt                  |
      | account.defendant.email_address_1       | paul.salt@outlook.com |
      | account.defendant.telephone_number_home | 02038219385           |
    And I am logged in with email "opal-test-10@HMCTS.NET"
    And I set the last created draft account status to "Deleted"
    When I open Check and Validate Draft Accounts
    And I view the "Deleted" tab on the Check and Validate page
    Then the checker status heading is "Deleted"
    Then I open the draft account for "Salt, Paul" and see header "Mr Paul SALT"
    And the draft account status tag is "Deleted"
    When I go back to Check and Validate Draft Accounts
    Then I should see the header containing text "Review accounts"

  @PO-1804
  Scenario: Open a fixed penalty account from the To review tab and return using Back
    Given a "fixedPenalty" draft account exists with:
      | Account_status              | Submitted |
      | account.defendant.forenames | FakeFixed |
      | account.defendant.surname   | FAKELAST  |
    And I am logged in with email "opal-test-10@HMCTS.NET"
    When I open Check and Validate Draft Accounts
    Then I open the draft account for "FAKELAST, FakeFixed" and see header "Mr FakeFixed FAKELAST"
    When I go back to Check and Validate Draft Accounts
    Then I should see the header containing text "Review accounts"

  @PO-1804
  Scenario: Open a fixed penalty company account from the To review tab and return using Back
    Given a "fixedPenaltyCompany" draft account exists with:
      | Account_status                 | Submitted               |
      | account.defendant.company_name | TestFixedPenaltyCompany |
    And I am logged in with email "opal-test-10@HMCTS.NET"
    When I open Check and Validate Draft Accounts
    Then I open the draft account for "TestFixedPenaltyCompany" and see header "TestFixedPenaltyCompany"
    When I go back to Check and Validate Draft Accounts
    Then I should see the header containing text "Review accounts"


  @PO-2463
  Scenario: Delete a fixed penalty company draft and return from the Deleted tab
    Given a "fixedPenaltyCompany" draft account exists with:
      | Account_status                 | Submitted               |
      | account.defendant.company_name | TestFixedPenaltyCompany |
    And I am logged in with email "opal-test-10@HMCTS.NET"
    When I open Check and Validate Draft Accounts
    Then I open the draft account for "TestFixedPenaltyCompany" and see header "TestFixedPenaltyCompany"
    When I delete the draft account from review and see the confirmation page
    When I confirm draft deletion with reason:
      | Reason | test reason YXZ123 |
    Then I should see the checker header "Review accounts" and status heading "To review"
    When I view the "Deleted" tab on the Check and Validate page
    Then I open the draft account for "TestFixedPenaltyCompany" and see header "TestFixedPenaltyCompany"
    And the draft account status tag is "Deleted"
    When I go back to Check and Validate Draft Accounts
    Then I should see the checker header "Review accounts" and status heading "Deleted"


  @PO-2463
  Scenario: Delete a fixed penalty draft and return from the Deleted tab
    Given a "fixedPenalty" draft account exists with:
      | Account_status              | Submitted |
      | account.defendant.forenames | FakeFixed |
      | account.defendant.surname   | FAKELAST  |
    And I am logged in with email "opal-test-10@HMCTS.NET"
    When I open Check and Validate Draft Accounts
    Then I open the draft account for "FAKELAST, FakeFixed" and see header "Mr FakeFixed FAKELAST"
    When I delete the draft account from review and see the confirmation page
    When I confirm draft deletion with reason:
      | Reason | test reason YXZ123 |
    Then I should see the checker header "Review accounts" and status heading "To review"
    When I view the "Deleted" tab on the Check and Validate page
    Then I open the draft account for "FAKELAST, FakeFixed" and see header "Mr FakeFixed FAKELAST"
    And the draft account status tag is "Deleted"
    When I go back to Check and Validate Draft Accounts
    Then I should see the checker header "Review accounts" and status heading "Deleted"

  @PO-2463
  Scenario: Reject a fixed penalty draft and return from the Rejected tab
    Given a "fixedPenalty" draft account exists with:
      | Account_status              | Submitted |
      | account.defendant.forenames | FakeFixed |
      | account.defendant.surname   | FAKELAST  |
    And I am logged in with email "opal-test-10@HMCTS.NET"
    When I open Check and Validate Draft Accounts
    Then I open the draft account for "FAKELAST, FakeFixed" and see header "Mr FakeFixed FAKELAST"
    And the draft account status tag is "In review"
    When I record the following decision on the draft account:
      | Decision | Reject                 |
      | Reason   | Testing review history |
    Then I should see the checker header "Review accounts" and status heading "To review"
    When I view the "Rejected" tab on the Check and Validate page
    Then I open the draft account for "FAKELAST, FakeFixed" and see header "Mr FakeFixed FAKELAST"
    And the draft account status tag is "Rejected"
    When I go back to Check and Validate Draft Accounts
    Then I should see the header containing text "Review accounts"

  @PO-2463
  Scenario: Reject a fixed penalty company draft and return from the Rejected tab
    Given a "fixedPenaltyCompany" draft account exists with:
      | Account_status                 | Submitted               |
      | account.defendant.company_name | TestFixedPenaltyCompany |
    And I am logged in with email "opal-test-10@HMCTS.NET"
    When I open Check and Validate Draft Accounts
    Then I open the draft account for "TestFixedPenaltyCompany" and see header "TestFixedPenaltyCompany"
    And the draft account status tag is "In review"
    When I record the following decision on the draft account:
      | Decision | Reject                 |
      | Reason   | Testing review history |
    Then I should see the checker header "Review accounts" and status heading "To review"
    When I view the "Rejected" tab on the Check and Validate page
    Then I open the draft account for "TestFixedPenaltyCompany" and see header "TestFixedPenaltyCompany"
    And the draft account status tag is "Rejected"
    When I go back to Check and Validate Draft Accounts
    Then I should see the header containing text "Review accounts"
