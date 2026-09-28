# DEF-001 Login long input returns HTTP 500

Status: New

Priority: High

Severity: High

Module: Login

Environment: Alpha Surety QA

Preconditions: User is on the Login page and test credentials are supplied through environment variables.

Steps:

1. Open the Login page.
2. Enter the long username or long password from the Login test data.
3. Submit the form.

Expected result: The application handles the long input gracefully with validation or a controlled rejection.

Actual result: The test-case workbook records HTTP 500 Internal Server Error for the long-input cases.

Evidence: day-2/test-cases.xlsx, cases TC-009 and TC-010.

Lifecycle record: New. Retest, Reopened, and final disposition require a reproducible execution with a captured response or screenshot.

Recommendation: Validate input length at the client or server boundary and return a controlled validation response.
