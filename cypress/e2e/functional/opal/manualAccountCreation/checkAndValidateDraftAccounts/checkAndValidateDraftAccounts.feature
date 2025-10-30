Feature: Check and Validate - Checker

  Background:
    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard

  @PO-594
  Scenario: As a user I can approve the account from review account screen
    And I create a "adultOrYouthOnly" draft account with the following details:
      | Account_status                          | Submitted                 |
      | account.defendant.forenames             | Larry                     |
      | account.defendant.surname               | Lincoln                   |
      | account.defendant.email_address_1       | larry.lincoln@outlook.com |
      | account.defendant.telephone_number_home | 02078219385               |

    Given I am on the Opal Frontend and I sign in as "opal-test-10@HMCTS.NET"
    Then I am on the dashboard

    Given I navigate to Check and Validate Draft Accounts
    And I see "Review accounts" on the page header

    And I click on the "Lincoln, Larry" link

    Then I see "Mr Larry LINCOLN" on the page header
    And the account status is "In review"
    #And I see the "Review history" section heading

    And I select the "Approve" radio button
    And I click on continue button
    And I see "Review accounts" on the page header


  @PO-594
  Scenario: As a user I can reject an account from review account screen
    And I create a "adultOrYouthOnly" draft account with the following details:
      | Account_status                          | Submitted                 |
      | account.defendant.forenames             | Larry                     |
      | account.defendant.surname               | Lincoln                   |
      | account.defendant.email_address_1       | larry.lincoln@outlook.com |
      | account.defendant.telephone_number_home | 02078219385               |

    Given I am on the Opal Frontend and I sign in as "opal-test-10@HMCTS.NET"
    Then I am on the dashboard

    Given I navigate to Check and Validate Draft Accounts
    And I see "Review accounts" on the page header

    And I click on the "Lincoln, Larry" link

    Then I see "Mr Larry LINCOLN" on the page header
    And the account status is "In review"
    #And I see the "Review history" section heading

    #AC.9 user selects the 'Back' button, they will be returned to the 'Review Accounts - To Review' screen
    And I click the back button link

    And I click on the "Lincoln, Larry" link
    Then I see "Mr Larry LINCOLN" on the page header

    And I select the "Reject" radio button
    And I enter "Testing review history" into the "Enter reason for rejection" text field
    And I click on continue button
    And I see "Review accounts" on the page header

  @PO-594
  Scenario: As a user I can delete an account from review screen
    #Given I create a "adultOrYouthOnly" draft account with the following details:
    And I create a "adultOrYouthOnly" draft account with the following details:
      | Account_status                          | Submitted                 |
      | account.defendant.forenames             | Larry                     |
      | account.defendant.surname               | Lincoln                   |
      | account.defendant.email_address_1       | larry.lincoln@outlook.com |
      | account.defendant.telephone_number_home | 02078219385               |

    Given I am on the Opal Frontend and I sign in as "opal-test-10@HMCTS.NET"
    Then I am on the dashboard

    Given I navigate to Check and Validate Draft Accounts
    And I see "Review accounts" on the page header

    And I click on the "Lincoln, Larry" link

    Then I see "Mr Larry LINCOLN" on the page header
    And the account status is "In review"
    #And I see the "Review history" section heading

    And I click on the "Delete account" link
    Then I see "Are you sure you want to delete this account?" on the page header

  @PO-969 @PO-601
  Scenario: As a user I can reject an account with a reason, and view the details of the rejected account
    #PO-601
    #AC1. If a user is on the Review Accounts screen - Rejected tab, and selects the name of a defendant associated to an account listed on the tab,
    # the user will be navigated to the Rejected Account screen for the draft account.

    #PO-969
    #AC.1 If a checker has opened a draft account with a submitted or resubmitted status via the Review Accounts -
    #To Review screen, and has selected both the 'Reject' radio button and provided a reason for rejection, then the following will occur upon the user selecting the 'Continue' button:
    And I create a "adultOrYouthOnly" draft account with the following details:
      | Account_status                          | Submitted                |
      | account.defendant.forenames             | Harry                    |
      | account.defendant.surname               | Potter                   |
      | account.defendant.email_address_1       | harry.potter@outlook.com |
      | account.defendant.telephone_number_home | 02078219385              |

    Given I am on the Opal Frontend and I sign in as "opal-test-10@HMCTS.NET"
    Then I am on the dashboard

    Given I navigate to Check and Validate Draft Accounts
    And I see "Review accounts" on the page header

    And I click on the "Potter, Harry" link
    Then I see "Mr Harry POTTER" on the page header
    And the account status is "In review"

    And I select the "Reject" radio button
    And I enter "Testing review history" into the "Enter reason for rejection" text field
    And I click on continue button
    And I see "Review accounts" on the page header
    And I see "To review" on the status heading
    And I see green banner on the top of the page

    And I see success message on the banner "You have rejected Harry Potter's account"

    Then I click on the "Rejected" link
    And I click on the "Potter, Harry" link
    Then I see "Mr Harry POTTER" on the page header
    And the account status is "Rejected"

    #PO-601
    #AC.8 I click the back link, I will be returned to the 'Review Accounts' screen
    And I click on the "Back" link

    Then I see "Review accounts" on the page header

  @PO-1073
  Scenario: As a user I can view an account that has failed to publish
    #AC1. If a user is on the Review Accounts screen - Failed tab, and selects the name of a defendant associated to an account listed on the tab,
    # the user will be navigated to the Failed Account screen for the draft account.
    Given I am on the Opal Frontend and I sign in as "opal-test-10@HMCTS.NET"
    Then I am on the dashboard

    ##IMPORTANT: We cannot create a failed account via the PATCH api, so need to mock it instead.
    Given I intercept the get failed accounts summaries to ensure there is an account returned
    Given I intercept the get failed account details to ensure there is an account returned

    And I navigate to Check and Validate Draft Accounts
    And I see "Review accounts" on the page header
    And I click on the "Failed" link
    And I see "Review accounts" on the page header
    And I see "GREEN, Oliver" text on the page
    And I click on the "GREEN, Oliver" link
    Then I see "Mr Oliver GREEN" on the page header

    #AC.8 I click the back link, I will be returned to the 'Review Accounts - Failed' screen
    And I click on the "Back" link

    Then I see "Review accounts" on the page header

  @PO-594
  Scenario: As a user I can approve the account from review account screen
    #Given I create a "adultOrYouthOnly" draft account with the following details:
    And I create a "adultOrYouthOnly" draft account with the following details:
      | Account_status                          | Submitted                 |
      | account.defendant.forenames             | Larry                     |
      | account.defendant.surname               | Lincoln                   |
      | account.defendant.email_address_1       | larry.lincoln@outlook.com |
      | account.defendant.telephone_number_home | 02078219385               |

    Given I am on the Opal Frontend and I sign in as "opal-test-10@HMCTS.NET"
    Then I am on the dashboard

    Given I navigate to Check and Validate Draft Accounts
    And I see "Review accounts" on the page header

    And I click on the "Lincoln, Larry" link

    Then I see "Mr Larry LINCOLN" on the page header
    And the account status is "In review"
    #And I see the "Review history" section heading

    And I select the "Approve" radio button
    And I click on continue button
    And I see "Review accounts" on the page header


  @PO-594
  Scenario: As a user I can reject an account from review account screen
    #Given I create a "adultOrYouthOnly" draft account with the following details:
    And I create a "adultOrYouthOnly" draft account with the following details:
      | Account_status                          | Submitted                 |
      | account.defendant.forenames             | Larry                     |
      | account.defendant.surname               | Lincoln                   |
      | account.defendant.email_address_1       | larry.lincoln@outlook.com |
      | account.defendant.telephone_number_home | 02078219385               |

    Given I am on the Opal Frontend and I sign in as "opal-test-10@HMCTS.NET"
    Then I am on the dashboard

    Given I navigate to Check and Validate Draft Accounts
    And I see "Review accounts" on the page header

    And I click on the "Lincoln, Larry" link

    Then I see "Mr Larry LINCOLN" on the page header
    And the account status is "In review"
    #And I see the "Review history" section heading

    #AC.9 user selects the 'Back' button, they will be returned to the 'Review Accounts - To Review' screen
    And I click the back button link

    And I click on the "Lincoln, Larry" link
    Then I see "Mr Larry LINCOLN" on the page header

    And I select the "Reject" radio button
    And I enter "Testing review history" into the "Enter reason for rejection" text field
    And I click on continue button
    And I see "Review accounts" on the page header

  @PO-597 @PO-616
  Scenario: As a user I can delete the account with reason entered, and view the details of the deleted account
    And I create a "adultOrYouthOnly" draft account with the following details:
      | Account_status                          | Submitted              |
      | account.defendant.forenames             | Peter                  |
      | account.defendant.surname               | BARNES                 |
      | account.defendant.email_address_1       | peter.barn@outlook.com |
      | account.defendant.telephone_number_home | 02078219334            |

    Given I am on the Opal Frontend and I sign in as "opal-test-10@HMCTS.NET"
    Then I am on the dashboard

    Given I navigate to Check and Validate Draft Accounts
    And I see "Review accounts" on the page header

    And I see "To review" on the status heading

    And I click on the "BARNES, Peter" link
    Then I see "Mr Peter BARNES" on the page header
    And I click on the "Delete account" link

    Then I see "Are you sure you want to delete this account?" on the page header
    And I enter "test reason YXZ123" into the "Reason" text field
    When I click the "Yes - delete" button

    And I see "Review accounts" on the page header
    And I see "To review" on the status heading

    Then I see green banner on the top of the page

    And I see success message on the banner "You have deleted BARNES, Peter's account"

    Then I click on the "Deleted" link

    #PO-616 AC1
    And I click on the "BARNES, Peter" link
    Then I see "Mr Peter BARNES" on the page header
    And the account status is "Deleted"

    Then I see the following in item 1 of the review history
      | title       | Deleted            |
      | description | test reason YXZ123 |

    #PO-616 AC8
    Then I click on the "Back" link
    And I see "Review accounts" on the page header
    And I see "Deleted" on the status heading

  @PO-597
  Scenario: As a user I can Cancel deleting the account
    And I create a "adultOrYouthOnly" draft account with the following details:
      | Account_status                          | Submitted              |
      | account.defendant.forenames             | Peter                  |
      | account.defendant.surname               | Barn                   |
      | account.defendant.email_address_1       | peter.barn@outlook.com |
      | account.defendant.telephone_number_home | 02078219334            |

    Given I am on the Opal Frontend and I sign in as "opal-test-10@HMCTS.NET"
    Then I am on the dashboard

    Given I navigate to Check and Validate Draft Accounts
    And I see "Review accounts" on the page header

    And I see "To review" on the status heading

    And I click on the "Barn, Peter" link
    Then I see "Mr Peter BARN" on the page header
    And I click on the "Delete account" link

    Then I see "Are you sure you want to delete this account?" on the page header
    And I click on the "No - cancel" link
    And I see "Mr Peter BARN" on the page header

    And I click on the "Delete account" link
    Then I see "Are you sure you want to delete this account?" on the page header
    And I enter "test reason" into the "Reason" text field


    Then I click "No - cancel", a window pops up and I click Cancel
    Then I see "Are you sure you want to delete this account?" on the page header

    #And I click on the "No - cancel" link
    And  I click "No - cancel", a window pops up and I click Ok
    # And I select OK on the pop up window
    And I see "Mr Peter BARN" on the page header

  @PO-969
  Scenario: As a user I can reject an account with reason
    #AC.1 If a checker has opened a draft account with a submitted or resubmitted status via the Review Accounts -
    #To Review screen, and has selected both the 'Reject' radio button and provided a reason for rejection, then the following will occur upon the user selecting the 'Continue' button:
    And I create a "adultOrYouthOnly" draft account with the following details:
      | Account_status                          | Submitted                |
      | account.defendant.forenames             | Harry                    |
      | account.defendant.surname               | Potter                   |
      | account.defendant.email_address_1       | harry.potter@outlook.com |
      | account.defendant.telephone_number_home | 02078219385              |

    Given I am on the Opal Frontend and I sign in as "opal-test-10@HMCTS.NET"
    Then I am on the dashboard

    Given I navigate to Check and Validate Draft Accounts
    And I see "Review accounts" on the page header

    And I click on the "Potter, Harry" link
    Then I see "Mr Harry POTTER" on the page header
    And the account status is "In review"

    And I select the "Reject" radio button
    And I enter "Testing review history" into the "Enter reason for rejection" text field
    And I click on continue button
    And I see "Review accounts" on the page header
    And I see "To review" on the status heading
    And I see green banner on the top of the page

    And I see success message on the banner "You have rejected Harry Potter's account"

    Then I click on the "Rejected" link
    And I click on the "Potter, Harry" link
    Then I see "Mr Harry POTTER" on the page header
    And the account status is "Rejected"

  @PO-968
  Scenario: As a user I can approve an account, and be informed if there is an error
    #AC.1a
    And I create a "adultOrYouthOnly" draft account with the following details:
      | Account_status                          | Submitted                |
      | account.defendant.forenames             | Hare                     |
      | account.defendant.surname               | Krishna                  |
      | account.defendant.email_address_1       | hare.krishna@outlook.com |
      | account.defendant.telephone_number_home | 02078219385              |

    And I create a "adultOrYouthOnly" draft account with the following details:
      | Account_status                          | Submitted              |
      | account.defendant.forenames             | Paul                   |
      | account.defendant.surname               | BLART                  |
      | account.defendant.email_address_1       | paul.blart@outlook.com |
      | account.defendant.telephone_number_home | 02078219385            |

    Given I am on the Opal Frontend and I sign in as "opal-test-10@HMCTS.NET"
    Then I am on the dashboard

    Given I navigate to Check and Validate Draft Accounts
    And I see "Review accounts" on the page header

    And I click on the "Krishna, Hare" link
    Then I see "Mr Hare KRISHNA" on the page header
    And the account status is "In review"

    And I select the "Approve" radio button
    And I click on continue button
    And I see "Review accounts" on the page header
    And I see "To review" on the status heading
    And I see green banner on the top of the page

    And I see success message on the banner "You have approved Hare Krishna's account"

    ## IMPORTANT: This is required to ensure a failure for PO-968 AC.3
    ## PO-968 AC.3
    Given I intercept the PATCH request for a draft account to ensure it returns a 400 error

    And I click on the "BLART, Paul" link
    Then I see "Mr Paul BLART" on the page header
    And the account status is "In review"
    And I select the "Approve" radio button
    And I click on continue button
    Then I should see the global error banner

  @PO-603
  Scenario: As a user I can select deleted account and navigated to deletion screen
    #AC.1
    And I create a "adultOrYouthOnly" draft account with the following details:
      | Account_status                          | Submitted             |
      | account.defendant.forenames             | Paul                  |
      | account.defendant.surname               | Salt                  |
      | account.defendant.email_address_1       | paul.salt@outlook.com |
      | account.defendant.telephone_number_home | 02038219385           |

    When I update the last created draft account with status "Deleted"

    Given I am on the Opal Frontend and I sign in as "opal-test-10@HMCTS.NET"
    Then I am on the dashboard

    Given I navigate to Check and Validate Draft Accounts
    And I see "Review accounts" on the page header

    Then I click on the "Deleted" link
    And I see "Deleted" tab on the page header

    And I click on the "Salt, Paul" link
    Then I see "Mr Paul SALT" on the page header
    And the account status is "Deleted"

    #AC.8 Back button
    When I click on the "Back" link
    And I see "Review accounts" on the page header
