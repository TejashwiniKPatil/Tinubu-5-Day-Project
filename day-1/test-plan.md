# Test Plan – Tinubu Surety

## Objective

To test the Tinubu Surety application with focus on Login and Application/Bond Creation.

## Features Owned

1. Login
2. Application/Bond Creation

## In Scope

1. **Login**
   - Valid login
   - Invalid login
   - Required field validation
   - Logout
2. **Application/Bond Creation**
   - Creating an application/bond
   - Required field validation
   - Search and select
   - Dropdowns and inputs
   - Valid and invalid data
   - Save/Submit
3. **Non-functional and gray-box checks (Day 5, Alpha only)**
   - Small k6 performance check on Login and one list call, against a defined SLA
   - Manual security checklist; no scanners and nothing destructive
   - Usability heuristics and accessibility checks
   - Gray-box tests based on the network calls behind form submission

## Out of Scope

- Features outside Login and Application/Bond Creation
- Production testing
- Database testing
- Large-scale load, stress, or soak testing (only the small Day 5 k6 check is in scope, run in a coordinated window)

## Test Environment

- **Application:** Tinubu Surety
- **Environment:** Alpha QA (https://alphanewui.tinubusurety.com)
- **Tool:** Playwright
- **Language:** TypeScript
- **Browser:** Chrome/Chromium
- **OS:** Windows

## Test Data

- Valid login credentials
- Invalid username/password
- Valid and invalid application data
- Boundary and empty values

Credentials must not be hardcoded.

## Risks

- Test environment may be unavailable
- Test account may not work
- Application changes may affect automation
- Requirements may be unclear

## Entry Criteria

Testing can start when:

1. QA environment is available.
2. Test account is available.
3. Login is available.
4. Application/Bond Creation is available.

## Exit Criteria

Testing is complete when:

- 0 open Severity-1 defects
- 0 open Severity-2 defects
- 100% smoke tests passed
- At least 85% regression tests passed
- Critical Login scenarios executed
- Critical Application/Bond Creation scenarios executed
- Failed tests are documented

## Severity Mapping

Defect reports use High, Medium, and Low. The exit criteria map them as follows:

- **Severity-1 = High:** blocks a critical workflow, causes data loss, or causes a server error
- **Severity-2 = Medium:** a feature works incorrectly and has a workaround
- **Severity-3 = Low:** cosmetic or messaging issue
