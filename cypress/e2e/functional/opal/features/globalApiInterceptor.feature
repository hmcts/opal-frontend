Feature: Global API Interceptor shows error banner for all CEP error codes

  @PO-1574
  Scenario Outline: Error Handling banner is triggered for <errorCode> error code
    ## CEP Error codes 400, 401, 403, 404, 406, 408, 415, 503, 500
    ## https://tools.hmcts.net/confluence/display/PO/API+Response+Handling+-+Common+Acceptance+Criteria

    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard

    When I click the Manual account creation link and trigger a <errorCode> error for the get businessUnits API
    Then I should see the global error banner
    And I reload the page
    And I should not see the global error banner

    Examples:
      | errorCode |
      | 400       |
      | 401       |
      | 403       |
      | 404       |
      | 406       |
      | 408       |
      | 415       |
      | 503       |
      | 500       |

  @PO-2109
  Scenario Outline: Global warning banner is displayed for retriable backend errors

    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard

    ## Retriable error response recieved
    When I click the Manual account creation link and trigger a 500 retriable error for the get businessUnits API
    Then I should see the retriable global warning banner
    And I see "Dashboard" on the page header
    And I reload the page
    And I see "Dashboard" on the page header
    And I should not see the global error banner


  @PO-2109
  Scenario Outline: Global warning banner is displayed with no-response backend errors

    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard

    ## No response recieved
    When I trigger a network failure for the get businessUnits API
    Then I should see the generic global warning banner
    And I see "Dashboard" on the page header
    And I reload the page
    And I see "Dashboard" on the page header
    And I should not see the global error banner

  @PO-2108
  Scenario Outline: Internal Server Error page is displayed for non-retriable backend errors

    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard

    ## Non-retriable (HTTP 500) error response received
    When I click the Manual account creation link and trigger a 500 non-retriable error for the get businessUnits API
    Then I see "Sorry, there is a problem with the service" on the page header
    And I see "Error code: OP67890." text on the page


  @PO-2110
  Scenario Outline: Concurrency Failure page is displayed for 409 concurrency backend errors

    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard

    ## Non-retriable concurrency (HTTP 409) error response received
    When I click the Manual account creation link and trigger a 409 non-retriable error for the get businessUnits API
    Then I see "Sorry, there is a problem" on the page header
    And I see "Something else was changed while you were doing this." text on the page
    And I see "Your changes have not been saved. You will need to start again." text on the page


  @PO-2111
  Scenario Outline: Permission Denied page is displayed for 403 permission backend errors

    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard

    ## Non-retriable permission (HTTP 403) error response received
    When I click the Manual account creation link and trigger a 403 non-retriable error for the get businessUnits API
    Then I see "You do not have permission for this" on the page header
    And I see "the account is outside your business unit and some features are restricted" text on the page
    And I see "you are not permitted to use this feature" text on the page
    And I see "If you think this is incorrect, contact your line manager." text on the page

  @PO-2223
  Scenario Outline: Global warning banner is displayed for retriable backend errors - FAE

    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard
    And I navigate to Search For An Account
    When I enter "NOMATCH999" into the "Reference or case number" field
    When I select the "Companies" tab
    And I click the Search button and trigger a 500 retriable error for the defendant accounts search API
    Then I should see the retriable global warning banner
    And I see "Search for an account" on the page header
    And I reload the page
    And I see "Search for an account" on the page header
    And I should not see the global error banner