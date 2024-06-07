Feature: Verifying Employer details page for defendant accounts

    Background:
        Given I am on the OPAL Frontend
        Then I see "Opal" in the header

        When I sign in as "opal-test@HMCTS.NET"
        Then I am on the dashboard

        When I navigate to Manual Account Creation
        Then I see "Account details" on the page header
        And I click continue to Create Account page

        Then I see "Create account" on the page header
        Then I click on "Employer details" link

    Scenario Outline: verifying re-routing triggers when user clicks on browser back button
        When I enter employer name "Steve Matthew"
        Then I try to trigger re-routing "<reRouting>"
        Then I select "<option>" to continue
        Then I see "<pageName>" on the page header
        Examples:
            | reRouting         | pageName         | option |
            | browserBackButton | Create account   | Ok     |
            | browserBackButton | Employer details | Cancel |
            | refreshPage       | Create account   | Ok     |
            | refreshPage       | Employer details | Cancel |
            | closingTab        | Create account   | Ok     |
            | closingTab        | Employer details | Cancel |
            | closingBrowser    | Create account   | Ok     |
            | closingBrowser    | Employer details | Cancel |
            | signOutButton     | Create account   | Ok     |
            | signOutButton     | Employer details | Cancel |
            | amendingURL       | Create account   | Ok     |
            | amendingURL       | Employer details | Cancel |