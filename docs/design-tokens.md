# Design tokens

Every value here lives in [`assets/css/tokens.css`](../assets/css/tokens.css) as
a CSS custom property. No other stylesheet hard-codes a colour, a font size or
a spacing value, so retheming the portal is a single-file edit.

---

## Colour

Contrast ratios below were computed from the WCAG relative-luminance formula.
**AA** needs 4.5:1 for body text and 3:1 for large text and the boundaries of
interactive controls.

### Text on white

| Token | Value | Ratio | Use |
|---|---|---|---|
| `--c-text` | `#111827` | **17.7:1** | Body copy |
| `--c-navy` | `#0F2557` | **14.8:1** | Headings, sidebar |
| `--c-text-secondary` | `#4B5563` | **7.6:1** | Supporting copy |
| `--c-primary` | `#1D5BD6` | **6.0:1** | Links, active nav |
| `--c-text-muted` | `#6B7280` | **4.8:1** | Placeholders, timestamps |

### Status colours

Each clears 4.5:1 on white *and* on its own tint, so status text is readable
whichever surface it lands on.

| Token | Value | On white | On tint |
|---|---|---|---|
| `--c-danger` | `#B91C1C` | **6.5:1** | **5.7:1** |
| `--c-success` | `#047857` | **5.5:1** | **4.9:1** |
| `--c-info` | `#1D5BD6` | **6.0:1** | **5.2:1** |
| `--c-warning` | `#B45309` | **5.0:1** | **4.6:1** |

### Inverted

| Pair | Ratio |
|---|---|
| White on `--c-primary` | **6.0:1** |
| White on `--c-primary-dark` | **8.2:1** |
| White on `--c-navy` (sidebar) | **14.8:1** |
| `#9DB9F2` accent on navy | **7.5:1** |

### Focus

The ring has to clear 3:1 against whatever sits behind it, which no single
colour does on both white and navy — so there are two.

| Token | Value | Against | Ratio |
|---|---|---|---|
| `--c-focus` | `#0B3FA8` | white | **9.2:1** |
| `--c-focus-inverse` | `#FFD166` | navy | **10.2:1** |

### Lines — read this before using a border token

| Token | Value | On white | Verdict |
|---|---|---|---|
| `--c-border` | `#E5E9F2` | 1.2:1 | **Decorative only** |
| `--c-border-strong` | `#D1D5DB` | 1.5:1 | **Decorative only** |
| `--c-border-input` | `#6B7280` | 4.8:1 | Control boundaries |

WCAG 2.2 § 1.4.11 requires 3:1 for the boundary of an interactive control.
Neither `--c-border` nor `--c-border-strong` meets it, so inputs, selects,
textareas and the language tiles all use `--c-border-input`. The lighter two
are for card edges and dividers, where the boundary is not the only cue that
something is there.

---

## Typography

`--font-sans` stacks Inter ahead of nine Noto Sans families. The browser walks
the stack **per character**, not per string, so a Hindi word inside an English
sentence still resolves correctly. See [typography.md](typography.md).

### Scale

A 1.250 major third from a 16px base, rounded to whole pixels.

| Token | Size | Use |
|---|---|---|
| `--fs-display` | 40px | Hero headline |
| `--fs-h1` | 32px | Page title |
| `--fs-h2` | 24px | Section heading |
| `--fs-h3` | 20px | Card heading |
| `--fs-h4` | 17px | Sub-heading |
| `--fs-body` | 16px | Body copy |
| `--fs-sm` | 15px | Navigation, secondary |
| `--fs-xs` | 13px | Captions, badges |

Nothing drops below 13px. Indic scripts carry vowel marks above and below the
baseline that start to collide at small sizes, so the floor is higher than a
Latin-only design would need.

### Line height

| Token | Value | Use |
|---|---|---|
| `--lh-tight` | 1.2 | Display and headings |
| `--lh-snug` | 1.35 | Card headings |
| `--lh-body` | 1.6 | Paragraphs |

1.6 for body is above the 1.5 WCAG asks for, and gives Devanagari and Bengali
conjuncts room without clipping.

### Measure

`--w-prose: 68ch` caps paragraph width. ISO 24495-1 (plain language) puts the
comfortable range at roughly 45–75 characters.

---

## Spacing

A 4px grid. Use a token, not an arbitrary pixel value.

| Token | Value | | Token | Value |
|---|---|---|---|---|
| `--sp-1` | 4px | | `--sp-6` | 24px |
| `--sp-2` | 8px | | `--sp-8` | 32px |
| `--sp-3` | 12px | | `--sp-10` | 40px |
| `--sp-4` | 16px | | `--sp-12` | 48px |
| `--sp-5` | 20px | | `--sp-16` | 64px |

---

## Radius and elevation

| Token | Value | Use |
|---|---|---|
| `--r-sm` | 6px | Small inline elements |
| `--r-md` | 8px | Buttons, inputs |
| `--r-lg` | 12px | Cards |
| `--r-xl` | 16px | Panels, modals |
| `--r-full` | 999px | Avatars, badges, chips |

Shadows are all tinted with the navy (`rgba(15, 37, 87, …)`) rather than pure
black, so they read as part of the palette instead of as grey haze.

| Token | Use |
|---|---|
| `--sh-sm` | Stat tiles |
| `--sh-md` | Cards at rest |
| `--sh-lg` | Card hover, dropdowns |
| `--sh-xl` | Modal surfaces |

---

## Layout

| Token | Value | Meaning |
|---|---|---|
| `--w-container` | 1200px | Max content width |
| `--w-prose` | 68ch | Readable measure |
| `--h-header` | 64px | Header height |
| `--w-sidebar` | 232px | Signed-in rail |
| `--tap-min` | 44px | Minimum target size |

### Breakpoints

Expressed in `rem` so they scale with the user's font size rather than fighting
it.

| Width | What changes |
|---|---|
| `30rem` (480px) | Language control collapses to its globe |
| `48rem` (768px) | Main nav collapses behind a disclosure button |
| `56rem` (896px) | Two-column splits stack |
| `60rem` (960px) | Sidebar becomes a horizontal scroller |

---

## Motion

| Token | Value |
|---|---|
| `--t-fast` | 120ms |
| `--t-base` | 180ms |
| `--ease` | `cubic-bezier(0.4, 0, 0.2, 1)` |

All of it is cancelled under `prefers-reduced-motion: reduce`.
