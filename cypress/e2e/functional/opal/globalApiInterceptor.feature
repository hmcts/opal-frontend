Feature: Global API Interceptor shows error banner for all CEP error codes

  @PO-1574
  Scenario Outline: Global API Interceptor - Error Hnadling banner is triggered for all CEP error codes
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



