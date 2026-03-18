@JIRA-LABEL:global-api-interceptor
Feature: Global API Interceptor shows error banner for all CEP error codes

  Background:
    Given I am logged in with email "opal-test@HMCTS.NET"

  Rule: Manual account creation entrypoint

    @JIRA-STORY:PO-1574
    Scenario Outline: Global error banner appears for <errorCode> responses when starting manual account creation
      ## CEP Error codes 400, 401, 403, 404, 406, 408, 415, 503, 500
      ## https://tools.hmcts.net/confluence/display/PO/API+Response+Handling+-+Common+Acceptance+Criteria

      When I attempt to open Manual Account Creation and the business units request fails with <errorCode>
      Then the global error banner is displayed
      And the global banner clears after refresh on the "Do you want to create a new account or transfer in?" page

      @JIRA-KEY:POT-3276
      Examples: 400 response
        | errorCode |
        | 400       |

      @JIRA-KEY:POT-3277
      Examples: 401 response
        | errorCode |
        | 401       |

      @JIRA-KEY:POT-3278
      Examples: 403 response
        | errorCode |
        | 403       |

      @JIRA-KEY:POT-3279
      Examples: 404 response
        | errorCode |
        | 404       |

      @JIRA-KEY:POT-3280
      Examples: 406 response
        | errorCode |
        | 406       |

      @JIRA-KEY:POT-3281
      Examples: 408 response
        | errorCode |
        | 408       |

      @JIRA-KEY:POT-3282
      Examples: 415 response
        | errorCode |
        | 415       |

      @JIRA-KEY:POT-3283
      Examples: 503 response
        | errorCode |
        | 503       |

      @JIRA-KEY:POT-3284
      Examples: 500 response
        | errorCode |
        | 500       |

    @JIRA-STORY:PO-2109 @JIRA-KEY:POT-3285
    Scenario: Global warning banner appears for retriable business units errors
      When I attempt to open Manual Account Creation and the business units request fails with a retriable 500 error
      Then the global warning banner is displayed with:
        | field        | value                                            |
        | title        | Temporary System Issue                           |
        | message      | Please try again later or contact the help desk. |
        | operation id | OP12345                                          |
      And the global banner clears after refresh on the "Do you want to create a new account or transfer in?" page

    @JIRA-STORY:PO-2109 @JIRA-KEY:POT-3286
    Scenario: Global warning banner appears for business units network failures
      When I attempt to open Manual Account Creation and the business units request fails due to a network error
      Then the global warning banner is displayed with:
        | field   | value                                                                 |
        | message | You can try again. If the problem persists, contact the service desk. |
      And the global banner clears after refresh on the "Do you want to create a new account or transfer in?" page

    @JIRA-STORY:PO-2108 @JIRA-KEY:POT-3287
    Scenario: Internal Server Error page is displayed for non-retriable business units errors
      When I attempt to open Manual Account Creation and the business units request fails with a non-retriable 500 error
      Then the error page shows:
        | field   | value                                      |
        | header  | Sorry, there is a problem with the service |
        | message | Error code: OP67890.                       |

    @JIRA-STORY:PO-2110 @JIRA-KEY:POT-3288
    Scenario: Concurrency Failure page is displayed for business units concurrency errors
      When I attempt to open Manual Account Creation and the business units request fails with a non-retriable 409 error
      Then the error page shows:
        | field   | value                                                           |
        | header  | Sorry, there is a problem                                       |
        | message | Something else was changed while you were doing this.           |
        | message | Your changes have not been saved. You will need to start again. |

    @JIRA-STORY:PO-2111 @JIRA-KEY:POT-3289
    Scenario: Permission Denied page is displayed for business units permission errors
      When I attempt to open Manual Account Creation and the business units request fails with a non-retriable 403 error
      Then the error page shows:
        | field   | value                                                                      |
        | header  | You do not have permission for this                                        |
        | message | the account is outside your business unit and some features are restricted |
        | message | you are not permitted to use this feature                                  |
        | message | If you think this is incorrect, contact your line manager.                 |


  Rule: Account search entrypoint

    Background:
      Given I am on the Account Search page - Individuals form displayed by default

    @JIRA-STORY:PO-2224 @JIRA-KEY:POT-3290
    Scenario: Internal Server Error page is displayed for non-retriable account search errors
      When I attempt a Companies account search for reference "NOMATCH999" with a non-retriable 500 error
      Then the error page shows:
        | field   | value                                      |
        | header  | Sorry, there is a problem with the service |
        | message | Error code: OP67890.                       |

    @JIRA-STORY:PO-2223 @JIRA-KEY:POT-3291
    Scenario: Global warning banner is displayed for retriable account search errors
      When I attempt a Companies account search for reference "NOMATCH999" with a retriable 500 error
      Then the global warning banner is displayed with:
        | field        | value                                            |
        | title        | Temporary System Issue                           |
        | message      | Please try again later or contact the help desk. |
        | operation id | OP12345                                          |
      And the global banner clears after refresh on the "Search for an account" page

