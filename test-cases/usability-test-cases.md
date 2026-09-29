# Usability and Accessibility Test Cases

Non-functional cases for Login and Bond Creation. USA-001 to USA-005 retest the findings in [day-5/usability-accessibility-review.md](../day-5/usability-accessibility-review.md). USA-006 to USA-011 cover the accessibility pass.

Record the browser, viewport, build, and tool version with every result. Use a non-stateful quote form (do not submit).

Automated run: `npm run test:usability`. The scans use axe-core (`@axe-core/playwright` 4.13) with the WCAG 2.1 A and AA rules, and fail only on serious or critical violations. Keyboard checks use an unknown username, so they never count toward lockout.

## Summary

| ID | Title | Area | Priority | Related | Automated test | Status (2026-09-29) |
|----|-------|------|----------|---------|----------------|---------------------|
| USA-001 | Long bond note wraps inside its content area | Bond view | Medium | UX-01, DEF-003 | Manual only | Failed (observed once; retest pending) |
| USA-002 | "On this page" panel does not cover content or buttons | Quote form | Medium | UX-02, DEF-009 | Manual only | Failed (screenshot evidence) |
| USA-003 | Each validation error is shown only once | Quote form | Low | UX-03, DEF-011 | Manual only | Failed (screenshot evidence) |
| USA-004 | Penalty limit error uses currency format | Quote form | Low | UX-04, DEF-007 | Manual only | Failed (screenshot evidence) |
| USA-005 | Company Name error uses one consistent wording | Quote form | Low | UX-05, DEF-006 | Manual only | Failed (observed; screenshot pending) |
| USA-006 | Automated accessibility scan finds no serious violations | Login, quote form | High | — | [usability.spec.ts](../tests/non-functional/usability.spec.ts) (USA-006a Login, USA-006b quote form) | **Failed**: serious or critical violations on both pages |
| USA-007 | Login can be completed with the keyboard only | Login | High | — | [usability.spec.ts](../tests/non-functional/usability.spec.ts) | Passed |
| USA-008 | Quote form and Cancel dialog work with the keyboard only | Quote form | High | — | [usability.spec.ts](../tests/non-functional/usability.spec.ts) | Partly passed (Cancel dialog focus only) |
| USA-009 | Focus is always visible and follows a logical order | Login, quote form | Medium | — | [usability.spec.ts](../tests/non-functional/usability.spec.ts) (Login only) | **Failed**: Sign In shows no focus indicator |
| USA-010 | Fields have accessible names and errors are announced | Login, quote form | High | TC-008 | [usability.spec.ts](../tests/non-functional/usability.spec.ts) (quote form) | **Failed**: 5 of 6 quote fields are not named by their label |
| USA-011 | Text meets color contrast requirements | Login, quote form | Medium | — | [usability.spec.ts](../tests/non-functional/usability.spec.ts) (Login only) | **Failed**: 1 element below the contrast minimum |

## USA-001 Long bond note wraps inside its content area

**Heuristic:** Aesthetic and minimalist design.

**Steps:**
1. Open a bond with a long note (500 characters or more, with no spaces).
2. View the bond at 1366×768 and at 1920×1080.

**Expected result:** The note wraps or scrolls inside its own area. The page has no horizontal scroll bar, and no content is clipped.

**Status:** Failed. The note overflowed the page in the Day 3 observation ([DEF-003](../day-3/defects/DEF-003-bond-note-overflows-layout.md)). Retest when the defect is fixed.

## USA-002 "On this page" panel does not cover content or buttons

**Heuristic:** Aesthetic and minimalist design.

**Steps:**
1. Open the quote form and add enough companies and people that the Principal & Indemnitors cards are taller than one row.
2. Scroll through the form.

**Expected result:** The "On this page" panel never covers text or action buttons, and every button can be clicked.

**Status:** Failed. See [DEF-009](../day-3/defects/DEF-009-on-this-page-nav-overlaps-action-buttons.md) and `screenshots/ui-bugs/on-this-page-nav-overlap.png`.

## USA-003 Each validation error is shown only once

**Heuristic:** Help users recognize, diagnose, and recover from errors.

**Steps:**
1. Open the quote form.
2. Enter Bond Amount 40000001 and submit.
3. Separately, leave Pre Pay Selection at "- Make Selection -" and submit.

**Expected result:** Each error appears once, in one place (the banner or inline), not repeated in several toasts.

**Status:** Failed. See [DEF-011](../day-3/defects/DEF-011-same-validation-error-shown-three-times.md) and `screenshots/ui-bugs/penalty-limit-duplicate-errors.png`.

## USA-004 Penalty limit error uses currency format

**Heuristic:** Match between system and the real world.

**Steps:**
1. Open the quote form.
2. Enter Bond Amount 40000001 and submit.

**Expected result:** The message shows the limit as currency, for example "$40,000,000", to match the Bond Amount field.

**Status:** Failed. Actual message: "Penalty must not exceed 40000000.0000." See [DEF-007](../day-3/defects/DEF-007-penalty-limit-error-shows-unformatted-number.md).

## USA-005 Company Name error uses one consistent wording

**Heuristic:** Consistency and standards.

**Steps:**
1. On the quote form, add a company and leave Company Name blank.
2. Try to save.

**Expected result:** One message, worded one way.

**Status:** Failed. The error was shown three times, in two wordings: "Company 1: Company Name is required." and "Company 1: 'Company Name' is required". See [DEF-006](../day-3/defects/DEF-006-duplicate-company-name-required-errors.md). A screenshot still needs to be attached.

## USA-006 Automated accessibility scan finds no serious violations

**Tool:** axe DevTools or Lighthouse (record the version).

**Steps:**
1. Run the scan on the Login page.
2. Sign in, open the quote form, and run the scan again.
3. Save the report for each page.

**Expected result:** No critical or serious violations (WCAG 2.1 AA). Record each moderate or minor finding with the affected component.

**Status:** Failed on 2026-09-29 (Chromium, 1280×720):
- Login page: `color-contrast` (serious), 1 element.
- Quote form: `aria-allowed-attr` (critical), 4 elements; `color-contrast` (serious), 13 elements; `label` (critical), 1 element.

Open the HTML report for the affected elements before logging defects.

## USA-007 Login can be completed with the keyboard only

**Steps:**
1. Open the Login page. Do not use the mouse.
2. Press Tab to reach Username, type the value, press Tab to reach Password, and type the value.
3. Press Tab to reach Sign In and press Enter.

**Expected result:** Every control can be reached in order and used, and the user signs in without the mouse.

**Status:** Passed on 2026-09-29 (automated, using an unknown username).

## USA-008 Quote form and Cancel dialog work with the keyboard only

**Steps:**
1. From the dashboard, reach Start a Bond with Tab and press Enter.
2. Select the agency, family, and bond with the keyboard only.
3. On the quote form, open each dropdown (Pre Pay Selection, Business Structure, Assigned Underwriter) and choose an option with the arrow keys and Enter.
4. Tab to Cancel and press Enter. In the dialog, check that focus is inside it, then choose "Yes, continue" with the keyboard.

**Expected result:** Every step can be completed without the mouse. Focus moves into the dialog when it opens and does not escape behind it.

**Status:** Partly passed on 2026-09-29. The automated check confirmed that focus moves into the Cancel dialog, lands on "Go back", and stays in the dialog after Tab. The dialog only opens when the form has unsaved changes. Steps 1 to 3 have not been run with the keyboard only.

## USA-009 Focus is always visible and follows a logical order

**Steps:**
1. On the Login page and the quote form, press Tab and then Shift+Tab through every control.
2. Record a short screen capture.

**Expected result:** A visible focus indicator is always shown, and the order follows the visual layout (top to bottom, left to right). Focus is never hidden behind the "On this page" panel or the navbar.

**Status:** Failed on 2026-09-29 for the Login page. The Sign In button receives keyboard focus (`:focus-visible` matches), but its outline, shadow, border, and background do not change, so there is no visible focus indicator. Username and Password passed. The quote form has not been checked.

## USA-010 Fields have accessible names and errors are announced

**Tool:** A screen reader (NVDA or Narrator) and the browser accessibility tree.

**Steps:**
1. On the Login page, move to each field and listen to what is announced.
2. Submit Login with blank fields and listen to the error.
3. On the quote form, check the announced names of required and optional fields, and submit with a required field empty.

**Expected result:** Each field is announced with its label and whether it is required. Error messages are announced when they appear.

**Status:** Failed on 2026-09-29 for the quote form. The accessible names of Bond Amount, Pre Pay Selection, Effective Date, State of Incorporation, and Assigned Underwriter do not include their visible labels. For example, Bond Amount is announced as "0 – 40000000" and Pre Pay Selection as "- Make Selection -" (their placeholders). Business Structure passed. On Login, automated TC-008 confirms the Username and Password labels. Screen reader checks have not been run.

## USA-011 Text meets color contrast requirements

**Steps:**
1. Use the axe results from USA-006, or a contrast checker, on body text, field labels, placeholder text, error text, and disabled buttons.

**Expected result:** Normal text has a contrast ratio of at least 4.5:1, and large text and interface controls at least 3:1.

**Status:** Failed on 2026-09-29 for the Login page: 1 element below the contrast minimum (axe `color-contrast`). The quote form has 13 such elements (see USA-006).
