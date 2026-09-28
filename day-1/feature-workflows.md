# Feature Workflows

## Bond Creation

### pre condition
user should be logged In

### Step 1: Start New Bond

1. Go to **Bonds**.
2. Select **Start New Bond** from the dropdown.
3. Go to **Select Agency**.
4. Search for an agency or select an agency from the dropdown.
5. Select **Commercial** or **Contract** as applicable.
6. Under **All Bond Forms**, select an available Bond.
7. Click **Select** for the chosen Bond.

### Step 2: Bond Information

Example selected Bond Type: **Agricultural Products Dealer**

1. Verify the header shows:

   * Agency: Test Agency
   * State: Virginia
   * Carrier: Fake a Bonding Company (Golden)
   * Bond Type: Agricultural Products Dealer

2. Under **Principal Information**, use **Find or Create Principal** to search and select a Principal.

### Step 3: Bond Details

3. Enter **Bond Amount**.

   * Mandatory
   * Numeric
   * Currency format with `$`
   * Range: $0 to $40,000,000 for this bond type (other bond types show their own range in the field label)

4. Select **Pre Pay Selection**.

   * Mandatory
   * Dropdown
   * Options: 1 year, 2 year, 3 year for this bond type (some bond types allow up to 5 years)

5. Enter **Existing Bond Number** if required.

   * Optional
   * Free text

6. Verify or select **Effective Date**.

   * Mandatory
   * Date picker
   * Defaults to today's date

7. Verify **Expiration Date**.

   * System calculated
   * Read-only
   * Not editable

8. Enter **Bond User Version** if required.

   * Optional
   * Free text

### Step 4: License and Permit

9. Enter **Contractor License Number**.

   * Optional
   * Free text

10. Enter **Contractor License Effective Date**.

    * Optional
    * Format: MM/DD/YYYY

11. Enter **Contractor License Bond Amount**.

    * Optional
    * Currency format: $0.00

12. Select **Contractor Has Proof Of Insurance** if applicable.

    * Optional
    * Checkbox

13. Select **Business Structure**.

    * Optional
    * Dropdown

14. Select **State of Incorporation**.

    * Optional
    * Dropdown

15. Enter **How many years have you held this license?**

    * Optional
    * Text/numeric input

16. Enter **Percentage of business done in state of incorporation**.

    * Optional
    * Text/numeric input

### Step 5: Surcharges and Discounts

17. Enter **Modifier Value (%)** if required.

    * Optional
    * Allowed range: 3% to 90%
    * Positive value represents surcharge
    * Negative value represents discount

### Step 6: Team Assignment

18. Select **Assigned Underwriter**.

    * Mandatory
    * Dropdown

19. Select **Assigned Producer**.

    * Optional
    * Dropdown

### Step 7: Notes and Instructions

20. Enter **Special Instructions** if required.

    * Optional
    * Maximum 500 characters

### Step 8: Finalize

21. Review all entered information.
22. Click Submit.
23. Verify that the bond is successfully submitted/created.
24. Use Cancel to discard the bond when required.




# Login and Logout Workflows

## Login

1. Open the Login URL.
2. Locate the mandatory Username field using the `Username` label.
3. Enter the QA username from the environment variables.
4. Locate the mandatory Password field using the `Password` label.
5. Enter the QA password from the environment variables.
6. Click the `Sign In` button.
7. Verify that the configured QA profile name is displayed.

## Logout

1. Login to the application.
2. Open the profile menu using the configured QA profile name.
3. Locate the `Log Out` button.
4. Click `Log Out`.
5. Verify that the user is returned to the Sign In page.
6. Verify that the page title is `Sign In`.

## Test Data Handling

* Username and password are stored in environment variables.
* Passwords must never be stored in source code.
* Application URLs, profile names, button names and page titles are stored as non-secret constants.


