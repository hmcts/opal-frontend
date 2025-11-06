Feature: Search and Matches Accessibility

  Background:
    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard
    When I navigate to Search For An Account

  Scenario: Check Search and Matches Accessibility with Axe-Core
    ## Check Accessibility on Individuals Tab
    When I click on the "Individuals" link

    Then I enter "*" into the "Last name" field
    Then I enter "*" into the "First names" field
    Then I enter "*" into the Date of birth field
    Then I enter "*" into the "National Insurance number" field
    Then I enter "*" into the "Address line 1" field
    Then I enter "*" into the "Postcode" field

    Then I click the "Search" button


    Then I check accessibility

    ## Check Accessibility on Companies Tab
    When I click on the "Companies" link
    Then I check accessibility

    ## Check Accessibility on Minor Creditors Tab
    When I click on the "Minor creditors" link
    Then I check accessibility

    ## Check Accessibility on Major Creditors Tab
    When I click on the "Major creditors" link
    Then I check accessibility

    ## Check Accessibility on Search Results
    When I click on the "Individuals" link
    Then I enter "Smith" into the "Last name" field
    Then I enter "John" into the "First names" field

    When I click the "Search" button
    Then I check accessibility
