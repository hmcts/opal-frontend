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

  @PO-2107 @PO-2109
  Scenario Outline: Global warning banner is displayed for retriable and no-response backend errors

    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard

    ## 2107 AC1 - Retriable error response recieved
    When I click the Manual account creation link and trigger a 500 retriable error for the get businessUnits API
    Then I should see the retriable global warning banner
    And I see "Dashboard" on the page header
    And I reload the page
    And I see "Dashboard" on the page header
    And I should not see the global error banner

    ## 2109 AC1 - No response recieved
    When I trigger a network failure for the get businessUnits API
    Then I should see the generic global warning banner
    And I see "Dashboard" on the page header
    And I reload the page
    And I see "Dashboard" on the page header
    And I should not see the global error banner

