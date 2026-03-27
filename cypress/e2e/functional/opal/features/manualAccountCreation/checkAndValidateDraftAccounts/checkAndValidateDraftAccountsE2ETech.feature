@JIRA-LABEL:manual-account-creation
Feature: Check and Validate Draft Accounts - Extra E2E Technical Scenarios

  Background:
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    Then I should be on the dashboard

  @JIRA-STORY:PO-2243
  Scenario Outline: Approve draft account for <scenario>
    Given a "<draftType>" draft account exists with:
      | Account_status    | Submitted         |
      | <identifierField> | <identifierValue> |
    And I am logged in with email "opal-test-10@dev.platform.hmcts.net"
    When I open Check and Validate Draft Accounts
    Then I open the draft account for "<listName>" and see header "<header>"
    And the draft account status tag is "In review"
    When I record the following decision on the draft account:
      | Decision | Approve |
    Then I should see the checker header "Review accounts" and status heading "To review"
    And the draft success banner is "<banner>"
    @skip @JIRA-IGNORE
    Examples: Adult
      | scenario            | draftType      | identifierField           | identifierValue        | listName                                  | header                                      | banner                                                               |
      | E2E auto test Adult | opalE2EAdultEn | account.defendant.surname | OPAL E TO E{uniqUpper} | OPAL E TO E{uniqUpper}, Opal Scenario one | Mr Opal Scenario one OPAL E TO E{uniqUpper} | You have approved Opal Scenario one OPAL E TO E{uniqUpper}'s account |

    @skip @JIRA-IGNORE
    Examples: Adult, Welsh
      | scenario                   | draftType      | identifierField           | identifierValue        | listName                                  | header                                      | banner                                                               |
      | E2E auto test Adult, Welsh | opalE2EAdultCy | account.defendant.surname | OPAL E TO E{uniqUpper} | OPAL E TO E{uniqUpper}, Opal Scenario two | Mr Opal Scenario two OPAL E TO E{uniqUpper} | You have approved Opal Scenario two OPAL E TO E{uniqUpper}'s account |

    @UAT-Technical @JIRA-KEY:POT-3306
    Examples: Parent/Guardian, Adult Major
      | scenario                             | draftType           | identifierField           | identifierValue        | listName                                    | header                                          | banner                                                                 |
      | E2E auto test Adult, with PG (Major) | opalE2EAdultPgMajor | account.defendant.surname | OPAL E TO E{uniqUpper} | OPAL E TO E{uniqUpper}, Opal Scenario three | Miss Opal Scenario three OPAL E TO E{uniqUpper} | You have approved Opal Scenario three OPAL E TO E{uniqUpper}'s account |

    @UAT-Technical @JIRA-KEY:POT-3307
    Examples: Parent/Guardian, Adult Minor
      | scenario                             | draftType           | identifierField           | identifierValue        | listName                                   | header                                         | banner                                                                |
      | E2E auto test Adult, with PG (Minor) | opalE2EAdultPgMinor | account.defendant.surname | OPAL E TO E{uniqUpper} | OPAL E TO E{uniqUpper}, Opal Scenario four | Miss Opal Scenario four OPAL E TO E{uniqUpper} | You have approved Opal Scenario four OPAL E TO E{uniqUpper}'s account |

    @UAT-Technical @JIRA-KEY:POT-3308
    Examples: Parent/Guardian, Youth to pay
      | scenario                       | draftType         | identifierField           | identifierValue        | listName                                   | header                                       | banner                                                                |
      | E2E auto test Youth, PG to pay | opalE2EYouthPgPay | account.defendant.surname | OPAL E TO E{uniqUpper} | OPAL E TO E{uniqUpper}, Opal Scenario five | Ms Opal Scenario five OPAL E TO E{uniqUpper} | You have approved Opal Scenario five OPAL E TO E{uniqUpper}'s account |

    @UAT-Technical @JIRA-KEY:POT-3309
    Examples: Youth
      | scenario                 | draftType        | identifierField           | identifierValue        | listName                                  | header                                      | banner                                                               |
      | E2E auto test Youth only | opalE2EYouthOnly | account.defendant.surname | OPAL E TO E{uniqUpper} | OPAL E TO E{uniqUpper}, Opal Scenario six | Mr Opal Scenario six OPAL E TO E{uniqUpper} | You have approved Opal Scenario six OPAL E TO E{uniqUpper}'s account |

    @UAT-Technical @JIRA-KEY:POT-3310
    Examples: Company
      | scenario              | draftType      | identifierField                | identifierValue                    | listName                           | header                             | banner                                                         |
      | E2E auto test Company | opalE2ECompany | account.defendant.company_name | OPAL E TO E S SCENARIO SEVEN{uniq} | OPAL E TO E S SCENARIO SEVEN{uniq} | OPAL E TO E S SCENARIO SEVEN{uniq} | You have approved OPAL E TO E S SCENARIO SEVEN{uniq}'s account |

    @UAT-Technical @JIRA-KEY:POT-3311
    Examples: Fixed Penalty Adult (Vehicle)
      | scenario                      | draftType                | identifierField           | identifierValue        | listName                                    | header                                        | banner                                                                 |
      | Fixed Penalty Adult (Vehicle) | opalE2EFixedPenaltyAdult | account.defendant.surname | OPAL E TO E{uniqUpper} | OPAL E TO E{uniqUpper}, Opal Scenario eight | Mr Opal Scenario eight OPAL E TO E{uniqUpper} | You have approved Opal Scenario eight OPAL E TO E{uniqUpper}'s account |

    @UAT-Technical @JIRA-KEY:POT-3312
    Examples: Fixed Penalty Youth (Non-Vehicle)
      | scenario                          | draftType                | identifierField           | identifierValue        | listName                                   | header                                       | banner                                                                |
      | Fixed Penalty Youth (Non-Vehicle) | opalE2EFixedPenaltyYouth | account.defendant.surname | OPAL E TO E{uniqUpper} | OPAL E TO E{uniqUpper}, Opal Scenario nine | Mr Opal Scenario nine OPAL E TO E{uniqUpper} | You have approved Opal Scenario nine OPAL E TO E{uniqUpper}'s account |

    @UAT-Technical @JIRA-KEY:POT-3313
    Examples: Fixed Penalty Company (Vehicle)
      | scenario                        | draftType                  | identifierField                | identifierValue                  | listName                         | header                           | banner                                                       |
      | Fixed Penalty Company (Vehicle) | opalE2EFixedPenaltyCompany | account.defendant.company_name | OPAL E TO E S SCENARIO TEN{uniq} | OPAL E TO E S SCENARIO TEN{uniq} | OPAL E TO E S SCENARIO TEN{uniq} | You have approved OPAL E TO E S SCENARIO TEN{uniq}'s account |
