# Day 5 Usability and Accessibility Review

## Nielsen walkthrough: evidence-backed observations

### UX-01: Long bond note overflows the page

**Finding:** The long bond note expands beyond its content area and causes horizontal overflow and clipping in the bond view.

**Heuristic:** Aesthetic and minimalist design.

**Severity:** Medium

**Evidence:**  screenshot recorded in [DEF-003](../day-3/defects/DEF-003-bond-note-overflows-layout.md).

**Status:** Observed once; retest and build details are pending.

### UX-02: On This Page panel obscures content

**Finding:** The “On This Page” navigation panel overlays bond content while scrolling, obscuring text and controls.

**Heuristic:** Aesthetic and minimalist design.

**Severity:** Medium

**Evidence:** [screenshots/ui-bugs/on-this-page-nav-overlap.png](../screenshots/ui-bugs/on-this-page-nav-overlap.png).

**Status:** Screenshot evidence; viewport and build details are not recorded. Logged as [DEF-009](../day-3/defects/DEF-009-on-this-page-nav-overlaps-action-buttons.md) (defect severity Low). The Medium rating here is usability severity, because the overlap hides controls the user needs.

### UX-03: Quote validation message is repeated

**Finding:** One quote validation failure is announced through multiple error toasts and an inline banner, repeating the same penalty message.

**Severity:** Low

**Evidence:** [screenshots/ui-bugs/penalty-limit-duplicate-errors.png](../screenshots/ui-bugs/penalty-limit-duplicate-errors.png).

**Status:** Observed in a screenshot. The exploratory session saw the same pattern for Pre Pay Selection, logged as [DEF-011](../day-3/defects/DEF-011-same-validation-error-shown-three-times.md).

**Heuristic:** Help users recognize, diagnose, and recover from errors.

### UX-04: Penalty limit is shown as a raw number

**Finding:** The error reads "Penalty must not exceed 40000000.0000." with no currency symbol or thousands separators, while the Bond Amount field itself uses currency format.

**Heuristic:** Match between system and the real world.

**Severity:** Low

**Evidence:** [screenshots/ui-bugs/penalty-limit-duplicate-errors.png](../screenshots/ui-bugs/penalty-limit-duplicate-errors.png). Logged as [DEF-007](../day-3/defects/DEF-007-penalty-limit-error-shows-unformatted-number.md).

**Status:** Screenshot evidence; build details are not recorded.

### UX-05: The same Company Name error is worded two ways

**Finding:** One missing Company Name is reported three times, in two formats: "Company 1: Company Name is required." and "Company 1: 'Company Name' is required".

**Heuristic:** Consistency and standards.

**Severity:** Low

**Evidence:** Bond Creation exploratory session. Logged as [DEF-006](../day-3/defects/DEF-006-duplicate-company-name-required-errors.md). A screenshot is still to be attached.

**Status:** Observed during the exploratory session.

UX-01 to UX-05 come from the Bond Creation screens. UX-01 and UX-05 still need screenshots in the repository.

## Accessibility pass

### Axe or Lighthouse scan on Login and one authenticated workflow

**Status:** Not run. Tool, runtime, and scan output are not available.

### Color contrast

**Status:** Not assessed. Capture axe or Lighthouse violations and the affected component.

### Accessible names and form labels

**Status:** Not assessed. Verify labels for required and optional fields and error announcements.

### Keyboard-only navigation

**Status:** Not assessed. Tab and Shift+Tab through navigation, form, dialogs, and submit or cancel controls.

### Focus order and visible focus

**Status:** Not assessed. Record a short sequence and screenshots of any lost or obscured focus.

Use an authenticated QA account and a non-stateful quote form. Record browser, viewport, build, axe or Lighthouse version, violations, and evidence before claiming a pass.
