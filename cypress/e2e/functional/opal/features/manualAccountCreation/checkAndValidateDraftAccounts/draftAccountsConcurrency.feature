@api @concurrency @PO-2117
Feature: Draft Accounts — ETag/If-Match Concurrency

  Background:
    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard

  @PO-2117
  Scenario: Successful update returns a new strong ETag
    And I create a "adultOrYouthOnly" draft account with the following details:
      | account_status              | Submitted |
      | account.defendant.forenames | Dave      |
      | account.defendant.surname   | Tag       |
    When I update the last created draft account with status "Publishing Pending"
    Then the update should succeed and return a new strong ETag
  # Inside the steps:
  # - GET reads strong, quoted ETag
  # - PATCH with If-Match succeeds (200)
  # - Response returns a new strong ETag (different from before)

  @PO-2117
  Scenario: Stale If-Match results in 409 Conflict
    And I create a "adultOrYouthOnly" draft account with the following details:
      | account_status              | Submitted |
      | account.defendant.forenames | Jim       |
      | account.defendant.surname   | Conflict  |
    When I try to update the last created draft account with a stale ETag I should get a conflict
# Inside the step:
# - GET etag1 → PATCH (200) → PATCH again with etag1 → 409
