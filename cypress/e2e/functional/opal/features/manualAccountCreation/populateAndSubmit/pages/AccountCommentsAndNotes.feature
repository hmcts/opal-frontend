@ManualAccountCreation @AccountCommentsAndNotes @PO-272 @PO-344 @PO-345 @PO-469 @PO-499 @PO-500
Feature: Manual account creation - Account Comments and Notes
  #This feature file contains tests for the Account Comments and Notes page of the Manual Account Creation journey that cannot be exercised in the component tests #
  #Validation tests are contained in the AccountCommentsAndNotesComponent.cy.ts component tests
  #Tests for conditional rendering (different defendant types) are contained in the AccountCommentsAndNotesComponent.cy.ts component tests

  Background:
    Given I am logged in with email "opal-test@HMCTS.NET"
    And I open Manual Account Creation from the dashboard

  Scenario: Providing account comments and notes updates the task status and persists the data [@PO-272, @PO-344, @PO-345, @PO-469, @PO-499, @PO-500]
    Given I start a fine manual account for business unit "West London" with defendant type "Adult or youth"
    Then the "Account comments and notes" task status is "Not provided"
    When I provide account comments "Test comments" and notes "Test notes"
    And returning to account details the "Account comments and notes" task the status is "Provided"
    When I view the "Account comments and notes" task
    Then the manual account comment and note fields show "Test comments" and "Test notes"

  Scenario: A new manual account starts with comments and notes not provided [@PO-272, @PO-344, @PO-345, @PO-469, @PO-499, @PO-500]
    Given I start a fine manual account for business unit "West London" with defendant type "Adult or youth"
    Then the "Account comments and notes" task status is "Not provided"
    When I view the "Account comments and notes" task
    Then the manual account comment and note fields show "" and ""

  Scenario: Unsaved account comments can be kept or discarded [@PO-272, @PO-344, @PO-345, @PO-469, @PO-499, @PO-500]
    Given I start a fine manual account for business unit "West London" with defendant type "Adult or youth"
    And I provide account comments "Test comments" and notes "Test notes"
    And I choose "Cancel" on the unsaved changes prompt for account comments
    Then the manual account comment field shows "Test comments"
    And the manual account note field shows "Test notes"
    When I choose "Ok" on the unsaved changes prompt for account comments
    Then the "Account comments and notes" task status is "Not provided"
    When I view the "Account comments and notes" task
    Then the manual account comment and note fields show "" and ""


  Scenario: Task navigation allows review after all sections are provided [@PO-272, @PO-469, @PO-499, @PO-500]
    Given I start a fine manual account for business unit "West London" with defendant type "Adult or youth"
    Then the "Account comments and notes" task status is "Not provided"

    And I have provided manual court details:
      | field             | value             |
      | LJA               | Avon              |
      | PCR               | 1234              |
      | enforcement court | West London VPFPO |

    And I have provided manual personal details from account details:
      | field          | value |
      | title          | Mr    |
      | first names    | FNAME |
      | last name      | LNAME |
      | address line 1 | Addr1 |

    And I have provided offence details from account details:
      | field          | value               |
      | offence date   | 2 weeks in the past |
      | offence code   | TP11003             |
      | result code    | Fine (FO)           |
      | amount imposed | 200                 |
      | amount paid    | 100                 |

    And I have provided manual payment terms:
      | field                 | value                  |
      | collection order      | Yes                    |
      | collection order date | 1 weeks ago            |
      | pay in full by        | 28 weeks in the future |

    Then the task statuses are:
      | task             | status   |
      | Court details    | Provided |
      | Personal details | Provided |
      | Offence details  | Provided |
      | Payment terms    | Provided |

    And I view the "Account comments and notes" task
    Then I can proceed to review account details from comments and notes and see the header "Check account details"

  Scenario: Account Comments and Notes - Axe Core
    Given I start a fine manual account for business unit "West London" with defendant type "Adult or youth"
    When I view the "Account comments and notes" task
    Then I check accessibility
