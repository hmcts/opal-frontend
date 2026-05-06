@JIRA-LABEL:global-api-interceptor
Feature: Global API Interceptor shows error banner for all CEP error codes

  Background:
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"

  Rule: Manual account creation entrypoint

    @JIRA-STORY:PO-1574
    Scenario Outline: Global error banner appears for <errorCode> responses when starting manual account creation
      ## CEP Error codes 400, 401, 403, 404, 406, 408, 415, 503, 500
      ## https://tools.hmcts.net/confluence/display/PO/API+Response+Handling+-+Common+Acceptance+Criteria

      When I attempt to open Manual Account Creation and the business units request fails with <errorCode>
      Then the global error banner is displayed
      And the global banner clears after refresh on the "Do you want to create a new account or transfer in?" page

      @JIRA-EPIC:PO-2219
      Examples: 400 response
        | errorCode |
        | 400       |

      @JIRA-EPIC:PO-2219
      Examples: 401 response
        | errorCode |
        | 401       |

      @JIRA-EPIC:PO-2219
      Examples: 403 response
        | errorCode |
        | 403       |

      @JIRA-EPIC:PO-2219
      Examples: 404 response
        | errorCode |
        | 404       |

      @JIRA-EPIC:PO-2219
      Examples: 406 response
        | errorCode |
        | 406       |

      @JIRA-EPIC:PO-2219
      Examples: 408 response
        | errorCode |
        | 408       |

      @JIRA-EPIC:PO-2219
      Examples: 415 response
        | errorCode |
        | 415       |

      @JIRA-EPIC:PO-2219
      Examples: 503 response
        | errorCode |
        | 503       |

      @JIRA-EPIC:PO-2219
      Examples: 500 response
        | errorCode |
        | 500       |

    @JIRA-EPIC:PO-2141
    @JIRA-STORY:
    Scenario: Global warning banner appears for retriable business units errors
      When I attempt to open Manual Account Creation and the business units request fails with a retriable 500 error
      Then the global warning banner is displayed with:
        | field        | value                                            |
        | title        | Temporary System Issue                           |
        | message      | Please try again later or contact the help desk. |
        | operation id | OP12345                                          |
      And the global banner clears after refresh on the "Do you want to create a new account or transfer in?" page

    @JIRA-EPIC:PO-2141
    @JIRA-STORY:PO-2109
    Scenario: Global warning banner appears for business units network failures
      When I attempt to open Manual Account Creation and the business units request fails due to a network error
      Then the global warning banner is displayed with:
        | field   | value                                                                 |
        | message | You can try again. If the problem persists, contact the service desk. |
      And the global banner clears after refresh on the "Do you want to create a new account or transfer in?" page

    @JIRA-EPIC:PO-2141
    @JIRA-STORY:PO-2108
    Scenario: Internal Server Error page is displayed for non-retriable business units errors
      When I attempt to open Manual Account Creation and the business units request fails with a non-retriable 500 error
      Then the error page shows:
        | field   | value                                      |
        | header  | Sorry, there is a problem with the service |
        | message | Error code: OP67890.                       |

    @JIRA-EPIC:PO-2141
    @JIRA-STORY:PO-2110
    Scenario: Concurrency Failure page is displayed for business units concurrency errors
      When I attempt to open Manual Account Creation and the business units request fails with a non-retriable 409 error
      Then the error page shows:
        | field   | value                                                           |
        | header  | Sorry, there is a problem                                       |
        | message | Something else was changed while you were doing this.           |
        | message | Your changes have not been saved. You will need to start again. |

    @JIRA-EPIC:PO-2141
    @JIRA-STORY:PO-2111
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

    @JIRA-EPIC:PO-2239
    @JIRA-STORY:PO-2224
    Scenario: Internal Server Error page is displayed for non-retriable account search errors
      When I attempt a Companies account search for reference "NOMATCH999" with a non-retriable 500 error
      Then the error page shows:
        | field   | value                                      |
        | header  | Sorry, there is a problem with the service |
        | message | Error code: OP67890.                       |

    @JIRA-EPIC:PO-2239
    @JIRA-STORY:PO-2223
    Scenario: Global warning banner is displayed for retriable account search errors
      When I attempt a Companies account search for reference "NOMATCH999" with a retriable 500 error
      Then the global warning banner is displayed with:
        | field        | value                                            |
        | title        | Temporary System Issue                           |
        | message      | Please try again later or contact the help desk. |
        | operation id | OP12345                                          |
      And the global banner clears after refresh on the "Search for an account" page


    @JIRA-STORY:PO-2225  @JIRA-EPIC:PO-2239
    Scenario: Global warning banner is displayed when the fixed penalty details API receives no response
      Given a published non-vehicle fixed penalty account exists:
        | first name        | Robert                  |
        | last name         | FixedPenaltyPo{uniq}    |
        | ticket number     | FPRPO2225{uniqUpper}    |
        | issuing authority | City of Metropolis      |
        | time of offence   | 14:30                   |
        | place of offence  | Main Street, Metropolis |
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
        | account.prosecutor_case_reference       | PCR-PO-2226-{uniqUpper}             |
        | account.collection_order_made           | false                               |
        | account.collection_order_made_today     | false                               |
        | account.payment_card_request            | false                               |
        | account.defendant.dob                   | 2001-07-16                          |
      When I search for the account by last name "ConcurrencyFae{uniq}" and open the latest result
      And I go to the Defendant details section and the header is "Defendant details"

    @JIRA-EPIC:PO-2239
    @JIRA-STORY:PO-2226
    Scenario: Concurrency Failure page is displayed when replacing a defendant account party returns a non-retriable conflict
      When I edit the Defendant details and change the First name to "Concurrency"
      And I save the defendant details and the Replace Defendant Account Party request fails with a non-retriable 409 error
      Then the error page shows:
        | field   | value                                                           |
        | header  | Sorry, there is a problem                                       |
        | message | Something else was changed while you were doing this.           |
        | message | Your changes have not been saved. You will need to start again. |
