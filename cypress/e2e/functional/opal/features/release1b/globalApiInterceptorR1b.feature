@JIRA-LABEL:global-api-interceptor
Feature: Global API Interceptor shows error banner for release 1b entrypoints

  Background:
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"

  Rule: Account search entrypoint

    Background:
      Given I am on the Account Search page - Individuals form displayed by default

    @JIRA-EPIC:PO-2239 @JIRA-STORY:PO-2224 @JIRA-TEST-KEY:PO-5279 @JIRA-NFR:PO-2542 @R1B
    Scenario: Internal Server Error page is displayed for non-retriable account search errors
      When I attempt a Companies account search for reference "NOMATCH999" with a non-retriable 500 error
      Then the error page shows:
        | field   | value                                      |
        | header  | Sorry, there is a problem with the service |
        | message | Error code: OP67890.                       |

    @JIRA-EPIC:PO-2239 @JIRA-STORY:PO-2223 @JIRA-TEST-KEY:PO-5280 @JIRA-NFR:PO-2542 @R1B
    Scenario: Global warning banner is displayed for retriable account search errors
      When I attempt a Companies account search for reference "NOMATCH999" with a retriable 500 error
      Then the global warning banner is displayed with:
        | field        | value                                            |
        | title        | Temporary System Issue                           |
        | message      | Please try again later or contact the help desk. |
        | operation id | OP12345                                          |
      And the global banner clears after refresh on the "Search for an account" page

    @JIRA-STORY:PO-2225  @JIRA-EPIC:PO-2239 @JIRA-TEST-KEY:PO-5281 @JIRA-NFR:PO-2542 @R1B
    Scenario: Global warning banner is displayed when the fixed penalty details API receives no response
      Given a published non-vehicle fixed penalty account exists:
        | first name        | Robert                               |
        | last name         | FixedPenaltyPo{uniq}                 |
        | ticket number     | FPRPO2225{uniqUpper}                 |
        | issuing authority | City of London Central Ticket Office |
        | time of offence   | 14:30                                |
        | place of offence  | Main Street, Metropolis              |
      When I search for the account by last name "FixedPenaltyPo{uniq}" and open the latest result
      And I open the Fixed penalty section and the fixed penalty details request receives no response
      Then the global warning banner is displayed with:
        | field   | value                                                                 |
        | title   | There was a problem                                                   |
        | message | You can try again. If the problem persists, contact the service desk. |
      And I should see the account summary header contains "ROBERT FIXEDPENALTYPO{uniqUpper}"

  Rule: Defendant account party replacement entrypoint

    Background:
      Given I clear all approved accounts
      And I create a "adultOrYouthOnly" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@dev.platform.hmcts.net":
        | Account_status                          | Submitted                           |
        | account.defendant.forenames             | Casey                               |
        | account.defendant.surname               | ConcurrencyFae{uniq}                |
        | account.defendant.email_address_1       | casey.concurrencyfae{uniq}@test.com |
        | account.defendant.telephone_number_home | 02078250042                         |
        | account.account_type                    | Fine                                |
        | account.prosecutor_case_reference       | PCRCONC{uniqUpper}                  |
        | account.collection_order_made           | false                               |
        | account.collection_order_made_today     | false                               |
        | account.payment_card_request            | false                               |
        | account.defendant.dob                   | 2001-07-16                          |
      When I search for the account by last name "ConcurrencyFae{uniq}" and open the latest result
      And I go to the Defendant details section and the header is "Defendant details"

    @JIRA-EPIC:PO-2239 @JIRA-STORY:PO-2226 @JIRA-TEST-KEY:PO-5282 @JIRA-NFR:PO-2542 @R1B
    Scenario: Concurrency failure discards defendant edit state
      # AC1: CTA-triggered Replace Defendant Account Party request fails with a non-retriable HTTP 409 concurrency response.
      When I edit the Defendant details and change the First name to "Concurrency"
      And I save the defendant details and the Replace Defendant Account Party request fails with a non-retriable 409 error
      # AC1a: Concurrency Failure page displays the expected design content.
      Then the error page shows:
        | field   | value                                                           |
        | header  | Sorry, there is a problem                                       |
        | message | Something else was changed while you were doing this.           |
        | message | Your changes have not been saved. You will need to start again. |
      # AC1b: Unsaved journey state is discarded after the concurrency failure.
      When I return to the dashboard using the HMCTS link
      And I search for the account by last name "ConcurrencyFae{uniq}" and open the latest result
      And I go to the Defendant details section and the header is "Defendant details"
      And I edit the Defendant details without making changes
      Then I should see the First name field still contains "Casey"

  Rule: Account note entrypoint

    Background:
      Given a published adult or youth defendant account exists:
        | first name                | Priya                |
        | last name                 | PermissionNote{uniq} |
        | prosecutor case reference | PCRPERM{uniqUpper}   |
        | date of birth             | 2001-05-15           |
      When I search for the account by last name "PermissionNote{uniq}" and open the latest result
      Then I should see the account summary header contains "Mr Priya PERMISSIONNOTE{uniqUpper}"

    @JIRA-EPIC:PO-2239 @JIRA-STORY:PO-2227 @JIRA-TEST-KEY:PO-5283 @JIRA-NFR:PO-2542 @R1B
    Scenario: Permission Denied page is displayed when the Add Note API returns a non-retriable permission error
      # AC1: CTA-triggered Add Note request fails with a non-retriable HTTP 403 permission response.
      When I open the Add account note screen and verify the header is Add account note
      And I save account note "Permission denied test note" and the Add Note request fails with a non-retriable 403 error
      # AC1a: Permission Denied page displays the expected design content.
      Then the error page shows:
        | field   | value                                                                      |
        | header  | You do not have permission for this                                        |
        | message | This may be because:                                                       |
        | message | the account is outside your business unit and some features are restricted |
        | message | you are not permitted to use this feature                                  |
        | message | If you think this is incorrect, contact your line manager.                 |
