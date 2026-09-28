# Test Case Workbook Review Notes

## TC-010 data/title mismatch

In the current workbook, TC-010's title and steps duplicate the excessively long username case in TC-009. The Playwright fixture models TC-010 as an excessively long password, which is needed to cover the password boundary partition separately.

Reconcile the workbook row with the intended password input and steps before presenting the final workbook. Until that correction is made, the workbook and automation do not match for TC-010. The automation does not claim this case passed; the workbook records the long-input behavior as HTTP 500.
