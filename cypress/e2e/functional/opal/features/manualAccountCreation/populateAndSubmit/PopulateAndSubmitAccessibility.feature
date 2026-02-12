Feature: Accessibility Tests for Populate and Submit Screens
  # This feature file ensures that key populate and submit screens meet accessibility standards using Axe-Core.

  Background:
    Given I am logged in with email "opal-test@hmcts.net"
    Then I should be on the dashboard

  Scenario: Dashboard is accessible after sign in
    Then I check the page for accessibility

  Scenario: Manual account creation start page is accessible
    When I open Manual Account Creation from the dashboard
    And I select manual account business unit "West London"
    And I choose manual account type "Fine"
    And I choose manual defendant type "Adult or youth only"
    Then I check the page for accessibility

  Scenario: Account details task list is accessible for fine accounts
    When I start a fine manual account for business unit "West London" with defendant type "Adult or youth only"
    Then I check the page for accessibility

  Scenario: Check account details page accessibility after completing required tasks
    When I start a fine manual account for business unit "West London" with defendant type "Adult or youth only"
    And I complete manual account creation with the following fields and defaults:
      | Section       | Field                                    | Value                               | Imposition |
      | Court         | Sending area or Local Justice Area (LJA) | Avon                                |            |
      | Court         | Prosecutor Case Reference                | 1234                                |            |
      | Court         | Enforcement court                        | West London VPFPO                   |            |
      | Personal      | Title                                    | Mr                                  |            |
      | Personal      | First names                              | FNAME                               |            |
      | Personal      | Last name                                | LNAME                               |            |
      | Personal      | Address line 1                           | Addr Line 1                         |            |
      | Personal      | Address line 2                           | Addr Line 2                         |            |
      | Personal      | Address line 3                           | Addr Line 3                         |            |
      | Personal      | Postcode                                 | TE1 1ST                             |            |
      | Personal      | Date of birth                            | 01/01/1990                          |            |
      | Personal      | Make and model                           | FORD FOCUS                          |            |
      | Personal      | Registration number                      | AB12 CDE                            |            |
      | Offence       | Offence code                             | HY35014                             | 1          |
      | Offence       | Date of sentence                         | 8 weeks in the past                 | 1          |
      | Offence       | Result code                              | Compensation (FCOMP)                | 1          |
      | Offence       | Amount imposed                           | 300                                 | 1          |
      | Offence       | Amount paid                              | 100                                 | 1          |
      | Offence       | Creditor type                            | Major                               | 1          |
      | Offence       | Creditor search                          | Temporary Creditor                  | 1          |
      | Payment terms | Collection order                         | No                                  |            |
      | Payment terms | Make collection order today              | Yes                                 |            |
      | Payment terms | Payment term                             | Lump sum plus instalments           |            |
      | Payment terms | Lump sum amount                          | 150                                 |            |
      | Payment terms | Instalment amount                        | 300                                 |            |
      | Payment terms | Payment frequency                        | Monthly                             |            |
      | Payment terms | Start date                               | 2 weeks in the future               |            |
      | Payment terms | Request payment card                     | Yes                                 |            |
      | Payment terms | There are days in default                | Yes                                 |            |
      | Payment terms | Date days in default were imposed        | 1 weeks in the past                 |            |
      | Payment terms | Default days                             | 100                                 |            |
      | Payment terms | Add enforcement action                   | Yes                                 |            |
      | Payment terms | Enforcement action option                | Hold enforcement on account (NOENF) |            |
      | Payment terms | Enforcement reason                       | Reason                              |            |
    Then the task statuses are:
      | Court details    | Provided |
      | Personal details | Provided |
      | Offence details  | Provided |
      | Payment terms    | Provided |
    When I check the manual account details
    Then I check the page for accessibility

  Scenario: Submission confirmation page is accessible
    When I start a fine manual account for business unit "West London" with defendant type "Adult or youth only"
    And I complete manual account creation with the following fields and defaults:
      | Section       | Field                                    | Value                               | Imposition |
      | Court         | Sending area or Local Justice Area (LJA) | Avon                                |            |
      | Court         | Prosecutor Case Reference                | 1234                                |            |
      | Court         | Enforcement court                        | West London VPFPO                   |            |
      | Personal      | Title                                    | Mr                                  |            |
      | Personal      | First names                              | FNAME                               |            |
      | Personal      | Last name                                | LNAME                               |            |
      | Personal      | Address line 1                           | Addr Line 1                         |            |
      | Personal      | Address line 2                           | Addr Line 2                         |            |
      | Personal      | Address line 3                           | Addr Line 3                         |            |
      | Personal      | Postcode                                 | TE1 1ST                             |            |
      | Personal      | Date of birth                            | 01/01/1990                          |            |
      | Personal      | Make and model                           | FORD FOCUS                          |            |
      | Personal      | Registration number                      | AB12 CDE                            |            |
      | Offence       | Offence code                             | HY35014                             | 1          |
      | Offence       | Date of sentence                         | 8 weeks in the past                 | 1          |
      | Offence       | Result code                              | Compensation (FCOMP)                | 1          |
      | Offence       | Amount imposed                           | 300                                 | 1          |
      | Offence       | Amount paid                              | 100                                 | 1          |
      | Offence       | Creditor type                            | Major                               | 1          |
      | Offence       | Creditor search                          | Temporary Creditor                  | 1          |
      | Payment terms | Collection order                         | No                                  |            |
      | Payment terms | Make collection order today              | Yes                                 |            |
      | Payment terms | Payment term                             | Lump sum plus instalments           |            |
      | Payment terms | Lump sum amount                          | 150                                 |            |
      | Payment terms | Instalment amount                        | 300                                 |            |
      | Payment terms | Payment frequency                        | Monthly                             |            |
      | Payment terms | Start date                               | 2 weeks in the future               |            |
      | Payment terms | Request payment card                     | Yes                                 |            |
      | Payment terms | There are days in default                | Yes                                 |            |
      | Payment terms | Date days in default were imposed        | 1 weeks in the past                 |            |
      | Payment terms | Default days                             | 100                                 |            |
      | Payment terms | Add enforcement action                   | Yes                                 |            |
      | Payment terms | Enforcement action option                | Hold enforcement on account (NOENF) |            |
      | Payment terms | Enforcement reason                       | Reason                              |            |
    Then the task statuses are:
      | Court details    | Provided |
      | Personal details | Provided |
      | Offence details  | Provided |
      | Payment terms    | Provided |
    When I check the manual account details
    And I submit the manual account for review
    Then I see the following text on the page "You've submitted this account for review"
    And I check the page for accessibility
