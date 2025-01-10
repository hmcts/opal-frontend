Feature: PO-605 - Create Accounts Rejected Tab

  Background:
    Given I am on the Opal Frontend and I sign in as "opal-test@hmcts.net"
    And I am on the dashboard

  Scenario Outline: AC1 - Rejected accounts tab suffix displaying correctly
    When I click on the "Create and Manage Draft Accounts" link and intercept the rejected accounts request changing the count to "<count>"
    Then I see the rejected tab has the suffix "<suffix>"

    Examples:
      | count | suffix |
      | 1     | 1      |
      | 50    | 50     |
      | 99    | 99     |
      | 100   | 99+    |

  Scenario: AC2 - No rejected accounts
    When I click on the "Create and Manage Draft Accounts" link
    And I click on the rejected tab and ensure there are no accounts
    And I see "Rejected" text on the page
    And I see "You have no rejected accounts" text on the page
    And I see "To resubmit accounts for other team members, you can view all rejected accounts" text on the page
    And I see the "view all rejected accounts" link

  Scenario: AC3 - 3 rejected accounts
    When I click on the "Create and Manage Draft Accounts" link and intercept the rejected accounts request changing the count to "3"
    And I click on the rejected tab and ensure there are three accounts

    Then I see "LNAME, FNAME1" text on the page
    And I see "LNAME, FNAME2" text on the page
    And I see "LNAME, FNAME3" text on the page

    And I see "To resubmit accounts for other team members, you can view all rejected accounts" text on the page
    And I see the "view all rejected accounts" link

  @only
  Scenario: AC4,5 - 26 rejected accounts
    When I click on the "Create and Manage Draft Accounts" link and intercept the rejected accounts request changing the count to "26"
    And I click on the rejected tab and ensure there are 26 accounts

    Then I see a table with the headings:
      | Defendant | Date of birth | Created | Account type | Business unit |

    And I see the following data in position 1 of the rejected accounts table:
      | LNAME, FNAME1 | 01/01/2000 | 1 day ago | Fine | West London |

