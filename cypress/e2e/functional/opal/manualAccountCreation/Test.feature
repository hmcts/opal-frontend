Feature:test


        Background:
                Given I am on the OPAL Frontend
                Then I see "Opal" in the header

                When I sign in as "opal-test@HMCTS.NET"
                Then I am on the dashboard
                When I navigate to Manual Account Creation

        Scenario: AC-03 positive: verify defendant type header and radio buttons
                When I see "Defendant type" section on the page
                Then I see "If sole trader, choose 'Adult or youth only'" on the defendant type header

                Then I check and verify radio buttons