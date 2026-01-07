@api @concurrency @PO-2117
Feature: Draft Accounts — ETag/If-Match Concurrency

  Background:
    Given I am logged in with email "opal-test@HMCTS.NET"
    Then I should be on the dashboard

  @PO-2117
  Scenario: Successful update returns a new strong ETag
    Given a "adultOrYouthOnly" draft account exists with:
      | account_status              | Submitted |
      | account.defendant.forenames | Dave      |
      | account.defendant.surname   | Tag{uniq}       |
    When I set the last created draft account status to "Publishing Pending"
    Then the last draft update should return a new strong ETag

  @PO-2117
  Scenario: Stale If-Match results in 409 Conflict
    Given a "adultOrYouthOnly" draft account exists with:
      | account_status              | Submitted |
      | account.defendant.forenames | Jim       |
      | account.defendant.surname   | Conflict{uniq}  |
    When I attempt a stale If-Match update on the last draft account with status "Publishing Pending"
    Then the stale If-Match update should return a conflict
