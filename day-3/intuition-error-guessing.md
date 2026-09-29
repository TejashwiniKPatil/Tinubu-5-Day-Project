# Intuition and Error Guessing

There are 77 error guesses for Login and Bond Creation, in three groups. Only the groups written before testing count toward the hit rate.

| Group | Guesses | Written | Counts toward hit rate |
|-------|---------|---------|------------------------|
| A. Original guesses | EG-01 to EG-12 | Before touching the application | Yes, once tested |
| B. Confirmed by defects and observations | EG-13 to EG-27 | After the bug was found, to record the pattern | No: the result was already known |
| C. New guesses | EG-28 to EG-77 | 2026-09-29 | Yes |

Status is Hit (the guessed failure happened), Miss (tested, the app behaved correctly), or Not Tested. Every Hit or Miss names its evidence.

## A. Original guesses (written before testing)

| ID | Guess | Area | Status | Evidence |
|----|-------|------|--------|----------|
| EG-01 | Double-clicking Submit creates a duplicate bond | Bond Creation | Not Tested | Related: DEF-005 shows the API creates duplicates (EG-15); confirm in the UI |
| EG-02 | Clicking Back after submission reopens an editable, stale application | Bond Creation | Not Tested | |
| EG-03 | Pasting 5,000 characters into Special Instructions bypasses the limit | Bond Creation | Not Tested | Related: the API accepts notes over 500 characters (EG-16); confirm in the UI |
| EG-04 | Refreshing midway through the bond wizard loses entered data | Bond Creation | Not Tested | Related: DEF-004 (EG-19) |
| EG-05 | An expired session still allows a protected action | Session | Not Tested | |
| EG-06 | Special characters in a company or principal name break search or submission | Bond Creation | Not Tested | |
| EG-07 | Opening the flow in a new tab loses the selected agency | Bond Creation | Not Tested | |
| EG-08 | Selecting an agency twice leaves the first agency in later steps | Bond Creation | Not Tested | |
| EG-09 | A dropdown that looks selected but is empty internally passes validation | Bond Creation | Not Tested | |
| EG-10 | Changing Pre Pay after the Effective Date leaves the Expiration Date stale | Bond Creation | Not Tested | |
| EG-11 | Browser forward navigation duplicates a draft application | Bond Creation | Not Tested | |
| EG-12 | A failed login followed by a valid one still shows the old error text | Login | Not Tested | |

## B. Confirmed by defects and observations (not counted)

These record the error patterns behind real findings, so they can be reused as guesses on the next feature.

| ID | Guess | Area | Status | Evidence |
|----|-------|------|--------|----------|
| EG-13 | An overlong username returns a server error instead of a validation message | Login | Hit | DEF-001; TC-009 returned HTTP 500 |
| EG-14 | An overlong password returns a server error | Login | Hit | DEF-001; TC-010 returned HTTP 500 |
| EG-15 | Sending the same create-bond request twice creates two bonds | Bond Creation API | Hit | DEF-005; TC-047 on 2026-09-28 created BondId 1012032 and 1012033 |
| EG-16 | The create-bond API accepts Special Instructions over 500 characters, so the limit is only checked in the browser | Bond Creation API | Hit | Tester observation, 2026-09-29; request and response still to be saved in `day-3/evidence/` |
| EG-17 | A maximum-length (500-character) note breaks the bond view layout | Bond Creation UI | Hit | DEF-003 |
| EG-18 | Submit says no principal is attached although one is shown | Bond Creation | Hit | DEF-002; TC-044 and TC-045 on 2026-09-29 stopped with "At least one person or company is required" |
| EG-19 | A newly created principal disappears after a page refresh | Bond Creation | Hit | DEF-004 |
| EG-20 | A company with a blank name is saved as "Unknown" instead of being blocked | Bond Creation | Hit | DEF-008 |
| EG-21 | One missing field is reported several times, in different wording | Bond Creation UI | Hit | DEF-006, DEF-011 |
| EG-22 | A limit error shows a raw number instead of currency | Bond Creation UI | Hit | DEF-007: "Penalty must not exceed 40000000.0000." |
| EG-23 | A side panel overlaps action buttons when the content grows | Bond Creation UI | Hit | DEF-009 |
| EG-24 | Placeholder or debug text leaks into the page | Bond Creation UI | Hit | DEF-010: stray "t2" text |
| EG-25 | The account locks on a different attempt from the one the messages promise | Login | Hit | Tester observation, 2026-09-29: Alpha locks on the fourth failed attempt, while the first failure says "2 attempts remain" |
| EG-26 | A renamed button label is not changed everywhere | Bond Creation UI | Hit | Observed 2026-09-29: the dashboard says "Start a Bond", the Bonds list still says "Start New Bond" |
| EG-27 | Principal search lists inactive accounts with the same name as the active one | Bond Creation | Hit | Observed 2026-09-29: three "NUI1157 DupCo LLC" results, two marked "Account must be activated before use" |

## C. New guesses (2026-09-29)

### Tested

| ID | Guess | Area | Status | Evidence |
|----|-------|------|--------|----------|
| EG-28 | After logout, a protected URL still shows data | Session | Miss | SEC-001 passed |
| EG-29 | A signed-out user opening `/bonds` sees bond data | Session | Miss | SEC-002 passed |
| EG-30 | The password appears in a request URL | Security | Miss | SEC-009 passed |
| EG-31 | The password is stored in local or session storage | Security | Miss | SEC-006 passed |
| EG-32 | A failed Login API call returns a stack trace or internal details | Security | Miss | SEC-007 passed |
| EG-33 | The HTTP address does not redirect to HTTPS | Security | Miss | SEC-008 passed |
| EG-34 | HTML typed into Special Instructions renders as HTML on the form | Security | Miss | SEC-004 passed on the form; where the saved note is displayed was not checked |
| EG-35 | A Bond Amount of -1 is accepted | Bond Creation | Miss | TC-027 passed |
| EG-36 | A Bond Amount of 40,000,001 is accepted | Bond Creation | Miss | TC-029 passed |
| EG-37 | A username with leading or trailing spaces logs in or crashes | Login | Miss | TC-015 passed: the login is refused |
| EG-38 | The main button shows no visible keyboard focus | Accessibility | Hit | USA-009: Sign In gets focus but its look does not change |
| EG-39 | Form fields are announced by their placeholder, not their label | Accessibility | Hit | USA-010: Bond Amount is announced as "0 – 40000000"; 5 of 6 fields fail |
| EG-40 | Some Login text is too faint to read | Accessibility | Hit | USA-006a and USA-011: 1 element below the contrast minimum |
| EG-41 | Custom dropdowns use ARIA attributes their role does not allow | Accessibility | Hit | USA-006b: `aria-allowed-attr`, 4 elements, critical |
| EG-42 | Keyboard focus escapes the Cancel dialog | Accessibility | Miss | USA-008 passed |
| EG-43 | Login cannot be completed with the keyboard alone | Accessibility | Miss | USA-007 passed |
| EG-44 | The Login page takes more than 3 seconds to load | Performance | Hit | PERF-006: 4.2 to 5.9 s over 4 runs |
| EG-45 | The dashboard takes more than 5 seconds after sign-in | Performance | Miss | PERF-003 passed |
| EG-46 | The chosen language is lost after a reload | Navbar | Miss | Observed 2026-09-29: Italiano stays after reload |
| EG-47 | Drag and drop upload fails where click-to-select works | Attachments | Miss | TC-073: the dropped file saved with HTTP 201 and was listed after reload |

### Not tested yet

| ID | Guess | Area |
|----|-------|------|
| EG-48 | Caps Lock on the password gives no warning | Login |
| EG-49 | The same username in different letter case is treated inconsistently | Login |
| EG-50 | Pressing Enter twice quickly sends two login requests and counts two failures | Login |
| EG-51 | The remaining-attempts message is wrong after a successful login in between | Login |
| EG-52 | A password pasted with a trailing space or new line fails with no explanation | Login |
| EG-53 | Logging out in one tab leaves another open tab usable | Session |
| EG-54 | A session timeout during a quote loses the entered data without warning | Session |
| EG-55 | Bond Amount typed as "10,000.50" or "$10,000" is misread | Bond Creation |
| EG-56 | Bond Amount "1e7" is accepted as 10,000,000 | Bond Creation |
| EG-57 | Bond Amount with leading zeros, such as "000100", is stored as typed | Bond Creation |
| EG-58 | Bond Amount with more than two decimals is rounded silently | Bond Creation |
| EG-59 | An impossible date such as 02/30/2026 is accepted as the Effective Date | Bond Creation |
| EG-60 | An Effective Date far in the past or future is accepted without warning | Bond Creation |
| EG-61 | Changing the agency after choosing a bond keeps the previous agency's bond | Bond Creation |
| EG-62 | A principal name with an apostrophe, such as O'Brien, breaks the search | Bond Creation |
| EG-63 | Emoji or non-Latin characters in Special Instructions are saved as "?" | Bond Creation |
| EG-64 | Line breaks in Special Instructions are lost after saving | Bond Creation |
| EG-65 | Modifier Value "3.0" or "90.5" is handled differently from 3 and 90 | Bond Creation |
| EG-66 | Clicking a navbar link with unsaved changes leaves without the Cancel warning | Navigation |
| EG-67 | Pressing Escape on the Cancel dialog leaves the page anyway | Navigation |
| EG-68 | A file type outside the allowed list, such as .exe, is accepted by drag and drop | Attachments |
| EG-69 | A file over 30 MB is accepted, or fails with no message | Attachments |
| EG-70 | A zero-byte file is saved as an attachment | Attachments |
| EG-71 | Uploading a file with the same name replaces the first attachment | Attachments |
| EG-72 | Save is enabled before the required Category is chosen | Attachments |
| EG-73 | The Private attachment checkbox has no effect | Attachments |
| EG-74 | The Arabic (right-to-left) layout breaks the navbar or the forms | Language |
| EG-75 | Longer Italian or German labels overflow their buttons | Language |
| EG-76 | Switching language during a quote clears the entered data | Language |
| EG-77 | Quick search with a partial bond number finds nothing | Navbar |

## Hit rate

| Group | Tested | Hits | Misses | Not Tested | Hit rate |
|-------|--------|------|--------|------------|----------|
| A. Original | 0 | 0 | 0 | 12 | Not recorded |
| C. New | 20 | 5 | 15 | 30 | 25% (5 of 20) |
| **Counted total** | **20** | **5** | **15** | **42** | **25%** |
| B. From defects (not counted) | 15 | 15 | 0 | 0 | — |

Hit rate = hits ÷ tested guesses, for groups A and C only. The five hits are EG-38 to EG-41 (accessibility) and EG-44 (Login page load).

Before a Hit in group C becomes a defect, log it with the bug-report skill. EG-16 and EG-25 still need their request, response, or screenshot saved in `day-3/evidence/`.
