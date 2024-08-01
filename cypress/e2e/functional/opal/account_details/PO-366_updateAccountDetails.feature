Feature: PO-366 updating the account details page to manage the account creation process
  Background:
    Given I am on the OPAL Frontend
    Then I see "Opal" in the header

    When I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard
    When I navigate to Manual Account Creation

    Then I see "Create account" as the caption on the page
    Then I see "Business unit and defendant type" on the page header
    And I enter "London South" into the business unit search box

    When I select adults and youth only
    Then I click on continue button

  Scenario: AC1-positive: verifying the account details page headings for adult or youth only defendant type
    Then I see "Create account" as the caption on the page
    Then I see "Account details" on the page header

  Scenario: AC2-positive: verifying the account details page where account being created and defendant type text
    Then I see "Create account" as the caption on the page
    Then I see "Account details" on the page header
    Then should display business unit account "London South West" I selected from Business unit and defendant type page
    Then should display defendant type "Adult or youth only" I selected from Business unit and defendant type page

  #Descoped
  # Scenario: AC3-positive: verify Court details section heading and sub-section link is not configured
  #   Then I see "Create account" as the caption on the page
  #   Then I see "Account details" on the page header
  #   Then I see "Court details" on the section heading
  #   When "Court details" is clicked, nothing happens

  Scenario: AC4-positive: verify Defendant details section heading and sub-section links are not configured, except employer details
    Then I see "Create account" as the caption on the page
    Then I see "Account details" on the page header
    Then I see "Defendant details" on the section heading
    #De-scoped by PO-360
    #When "Personal details" is clicked, nothing happens
    When I click on the "Contact details" link
    Then I see "Contact details" on the page header
    Then I click cancel on Contact details page
    Then I click on the "Employer details" link
    Then I see "Employer details" on the page header

#Descoped
# Scenario: AC5-positive: verify Offences and imposition details section heading and sub-section links are not configured
#   Then I see "Create account" as the caption on the page
#   Then I see "Account details" on the page header
#   Then I see "Offence and imposition details" on the section heading
#   When "Offence details" is clicked, nothing happens
#   When "Payment terms" is clicked, nothing happens

# Scenario: AC6-positive: verify review and publish Review account
#   When I see "Review and publish" on the section heading
#   #When I check text under review and publish "Check that all required fields have been entered before you publish"
#   When "Review account" button is clicked, nothing happens
#   When "Cancel account creation" link is clicked, nothing happens
