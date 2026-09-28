# Intuition and Error Guessing

These guesses were written before touching the application. Each result must be marked Hit, Miss, or Not Tested after execution with evidence.

1. Double-clicking Submit creates a duplicate bond.
2. Clicking Back after submission creates a stale editable application.
3. Pasting 5,000 characters into Special Instructions bypasses the limit.
4. Refreshing midway through the bond wizard loses entered data.
5. An expired session allows a protected action to continue.
6. Special characters in a company or principal name break search or submission.
7. Opening the flow in a new tab loses selected agency context.
8. Selecting an agency twice leaves the first agency in downstream state.
9. Submitting with a required dropdown visually selected but internally empty bypasses validation.
10. Changing Pre Pay after an Effective Date leaves Expiration Date stale.
11. Browser forward navigation duplicates a draft application.
12. A failed login followed by valid credentials displays stale error text.

Execution status: Not tested. No hit-rate result is claimed.

Related evidence, not counted as hits: sending the same create-bond API request twice creates duplicate bonds (DEF-005), which supports guess 1, and a created principal disappears after refresh (DEF-004), which relates to guess 4. Confirm each guess in the UI before marking it Hit or Miss.

Hit count: Not recorded
Miss count: Not recorded
Not tested count: 12
Hit rate calculation: Hits divided by tested guesses. Record the counts and evidence after execution.
