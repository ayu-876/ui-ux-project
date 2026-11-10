# Accessibility

Target: **WCAG 2.2 Level AA**. A government service portal has a wider range of
users than almost any other kind of site — older citizens, people on cheap
phones, people using a screen reader, people reading a language the designer
does not — so accessibility is not a finishing pass here.

---

## Colour and contrast

Every text pair clears 4.5:1. Measured ratios are in
[design-tokens.md](design-tokens.md); the headline figures:

| | Ratio |
|---|---|
| Body text on white | 17.7:1 |
| Secondary text on white | 7.6:1 |
| Links on white | 6.0:1 |
| Lowest text pair in the system (warning on its tint) | 4.6:1 |

**Colour is never the only signal.** (WCAG 1.4.1)

- Form errors pair red with a warning icon *and* a sentence naming the problem
- The selected language gets a tick glyph *and* a heavier border *and*
  `aria-pressed="true"`
- The current step in the form stepper is marked with `aria-current="step"` and
  the words "(current step)" for screen readers
- Status badges carry a word, not just a colour

**Control boundaries clear 3:1.** (WCAG 1.4.11) `--c-border` (1.2:1) and
`--c-border-strong` (1.5:1) are decorative dividers only. Every input, select,
textarea and language tile uses `--c-border-input` at 4.8:1.

---

## Focus

```css
:focus-visible {
  outline: 3px solid var(--c-focus);
  outline-offset: 2px;
}

.sidebar :focus-visible {
  outline-color: var(--c-focus-inverse);
}
```

A 3px ring at 9.2:1 against white. On the navy sidebar a blue ring would be
invisible, so it flips to amber at 10.2:1. `:focus-visible` rather than
`:focus` keeps the ring off mouse clicks without costing keyboard users the
indicator WCAG 2.4.7 requires.

The **skip link** is the first tab stop on every page and becomes visible on
focus.

---

## Target size

`--tap-min: 44px` is applied as `min-height` on buttons, nav links, sidebar
items, language tiles and form controls — satisfying WCAG 2.2 § 2.5.8 by
construction rather than per instance.

---

## Semantics

- One `<h1>` per page, headings in order, never skipped for visual effect
- Landmarks: `<header>`, `<nav aria-label="…">`, `<main id="main">`, `<footer>`
- Both navigations are labelled, so a screen reader distinguishes "Main" from
  "Your account"
- The service catalogue, glossary terms and notifications are real lists
- Buttons are `<button>` and links are `<a>` — the language tiles change the
  current page rather than navigating, so they are buttons with `aria-pressed`
- Decorative SVG carries `aria-hidden="true"`; meaningful icon-only controls
  carry `aria-label`

---

## Forms

```html
<label class="field__label" for="aadhaar">
  Aadhaar number <span class="field__req" aria-hidden="true">*</span>
  <span class="sr-only"> (required)</span>
</label>
<input class="input" id="aadhaar" aria-describedby="aadhaar-hint aadhaar-err" …>
<span class="field__hint" id="aadhaar-hint">12 digits, spaces are fine.</span>
<span class="field__error" id="aadhaar-err" hidden>…</span>
```

- Every control has a real `<label>`, never a placeholder standing in for one
- The asterisk is hidden from screen readers; the word "required" is in the
  label instead
- Hint and error are linked with `aria-describedby`, so both are announced
- On submit, `aria-invalid` is set and **focus moves to the first invalid
  field**
- Errors say what is wrong in words — "Aadhaar number is required", not
  "Invalid"
- Placeholders are examples (`1234 5678 9012`), never instructions

---

## Dynamic content

- A polite live region (`#live-region`) announces language changes
- The glossary search announces how many terms matched, so someone who cannot
  see the list shrink still learns the result
- The chat transcript is `role="log" aria-live="polite"`, so replies are read
  without interrupting
- Glossary disclosures use `aria-expanded` on the trigger and `aria-controls`
  pointing at a panel toggled with the `hidden` attribute — which removes it
  from the accessibility tree, not just from view
- `Escape` closes the mobile menu and returns focus to the button that opened it

---

## Language

- `<html lang>` updates when the language changes
- Elements showing a different language from the page carry their own `lang`
  (WCAG 3.1.2) — without it, a screen reader reads Kannada with English
  phonetics
- The language picker shows endonyms first, so it is usable by someone who
  cannot read Latin script
- Copy is written to plain-language principles (ISO 24495-1): short sentences,
  everyday words, and the glossary for the terms that cannot be avoided

---

## User preferences

| Preference | Response |
|---|---|
| `prefers-reduced-motion: reduce` | All transitions and smooth scrolling cancelled |
| `forced-colors: active` | Borders restored on buttons, cards and inputs so boundaries survive |
| Print | Header, sidebar and skip link hidden; cards avoid page breaks |

Breakpoints are in `rem`, so a user who raises their default font size gets an
earlier, roomier layout instead of a cramped one.

---

## Responsive behaviour

Tested at 360px, 390px and 1280px.

- Below 30rem the language control collapses to its globe — it keeps its
  `aria-label`, so nothing is lost non-visually
- Below 48rem the main nav collapses behind a labelled disclosure button
- Below 60rem the sidebar becomes a horizontal scroller rather than an
  off-canvas drawer — no focus trap, and every item stays reachable
- No horizontal page scroll at any tested width

---

## What was verified

Checked in Chrome at 360px, 390px and 1280px:

- Contrast ratios computed from the WCAG relative-luminance formula for every
  token pair
- No horizontal page scrolling at any tested width
- Keyboard-only walkthrough of all nine pages: skip link, tab order, visible
  focus throughout
- Form submission with empty fields — errors shown, announced and focused
- Glossary search and disclosure, assistant replies, language switching and
  persistence across pages
- Zero console errors or warnings on every page

## What has not been verified

Honest limits of a prototype:

- **No screen reader testing.** NVDA, JAWS and TalkBack behaviour is predicted
  from the markup, not observed.
- **No testing with the people this is for.** Indic-script screen reader
  support varies a lot by combination, and the only way to know is to watch
  someone use it.
- **Translations are unreviewed.** `i18n.js` covers the shell only, and no
  native speaker has checked the strings. They must be reviewed before any
  real deployment.
- **No automated audit** (axe, Lighthouse) has been run in CI.
