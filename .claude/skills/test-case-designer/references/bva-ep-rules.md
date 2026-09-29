# BVA and EP Rules

## Login Boundaries

### Username and Password
Both are required. Partitions: valid, invalid, blank, and excessively long. No maximum length is documented. The long-input cases (TC-009, TC-010) return HTTP 500 (DEF-001), so leave the expected maximum as "requirement to confirm".

### Lockout Attempt Count
The account locks on the third consecutive failed attempt (TC-011 to TC-014). Test the boundaries at 2 failures (still signed out), 3 failures (locked), and a valid login while locked (stays locked).

## Bond Creation Boundaries

Limits vary by bond type. The values below are for the Agricultural Products Dealer bond used in the workbook. For other bond types, use the range shown in the field label and the valid values listed in the validation message.

### Bond Amount
Required. Numeric currency. Accepted range is $0 through $40,000,000. Alpha confirms the upper limit with "Penalty must not exceed 40000000.0000" (DEF-007). Another bond type observed, Annual - Pre-Defined Penalty (TEST), shows "$0 – $1,000,000".

### Modifier Value
Positive values are allowed from 3% through 90%. Negative-range behavior is not specified.

### Special Instructions
Optional. Maximum length is 500 characters.

### Effective Date
Required. Defaults to today's date.

### Expiration Date
System-calculated and read-only.

### Pre Pay Selection
Required. The options shown are "1 Year", "2 Years", and "3 Years" (observed 2026-09-29). Another bond type observed (Annual, PrePaidDuration=5) accepts 1 through 5 years and offers a "5 Years" option (DEF-011).
