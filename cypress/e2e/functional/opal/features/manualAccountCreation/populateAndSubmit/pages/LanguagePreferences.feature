@JIRA-LABEL:manual-account-creation
@manualAccountCreation @languagePreferences @JIRA-STORY:PO-272 @JIRA-STORY:PO-344 @JIRA-STORY:PO-345 @JIRA-STORY:PO-545 @JIRA-STORY:PO-464 @JIRA-STORY:PO-465 @JIRA-STORY:PO-542 @JIRA-STORY:PO-544 @JIRA-STORY:PO-1396
Feature: Manual account creation - Language preferences
  # This feature file contains tests for the Language preferences page of the
  # Manual Account Creation journey that cannot be exercised in the component tests #

  Background:
    Given I am logged in with email "opal-test-8@dev.platform.hmcts.net"
    And I start a fine manual account using the default business unit with defendant type "Adult or youth only"


  @JIRA-KEY:POT-3119
  Scenario: Language preferences persist within a session and reset after restart
    Then the manual language preferences in account details are:
      | Documents      | English only |
      | Court hearings | English only |

    When I view manual language preferences from account details for "Documents"
    Then the manual language preference options are visible:
      | Section        | Option            |
      | Documents      | Welsh and English |
      | Documents      | English only      |
      | Court hearings | Welsh and English |
      | Court hearings | English only      |

    When I update manual language preferences to:
      | Documents      | Welsh and English |
      | Court hearings | Welsh and English |

    Then the manual language preferences in account details are:
      | Documents      | Welsh and English |
      | Court hearings | Welsh and English |

    When I view manual language preferences from account details for "Court hearings"
    Then the manual language preference selections are:
      | section        | option            | state    |
      | Documents      | Welsh and English | selected |
      | Court hearings | Welsh and English | selected |

    When I refresh the application
    And I restart manual fine account using the default business unit with defendant type "Adult or youth only"

    Then the manual language preferences in account details are:
      | Documents      | English only |
      | Court hearings | English only |

    When I view manual language preferences from account details for "Documents"
    Then the manual language preference selections are:
      | section        | option            | state        |
      | Documents      | English only      | selected     |
      | Documents      | Welsh and English | not selected |
      | Court hearings | English only      | selected     |
      | Court hearings | Welsh and English | not selected |

  @JIRA-KEY:POT-3120
  Scenario: Unsaved language preference changes are cleared when cancel is confirmed
    When I view manual language preferences from account details for "Documents"
    And I set manual language preferences:
      | Documents      | Welsh and English |
      | Court hearings | Welsh and English |
    And I cancel manual language preferences choosing "Cancel"
    Then the manual language preference selections are:
      | section        | option            | state    |
      | Documents      | Welsh and English | selected |
      | Court hearings | Welsh and English | selected |

    When I cancel manual language preferences choosing "Ok" and return to account details
    Then the manual language preferences in account details are:
      | Documents      | English only |
      | Court hearings | English only |

    When I view manual language preferences from account details for "Documents"
    Then the manual language preference selections are:
      | section        | option            | state        |
      | Documents      | English only      | selected     |
      | Documents      | Welsh and English | not selected |
      | Court hearings | English only      | selected     |
      | Court hearings | Welsh and English | not selected |


  @JIRA-KEY:POT-3121
  Scenario: Language preferences - Axe Core
    When I view manual language preferences from account details for "Documents" and check accessibility
