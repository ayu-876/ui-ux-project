# Typography

Twelve languages across nine writing systems is the hardest constraint in this
project. This is how the type is set up and why.

---

## The ten families

| Family | Script | Languages served | Weights | Size |
|---|---|---|---|---|
| Inter | Latin | English | 400–800 | 132 KB |
| Noto Sans Devanagari | Devanagari | Hindi, Marathi | 400, 700 | 120 KB |
| Noto Sans Bengali | Bengali | Bengali, Assamese | 400, 700 | 104 KB |
| Noto Sans Oriya | Odia | Odia | 400, 700 | 96 KB |
| Noto Sans Gujarati | Gujarati | Gujarati | 400, 700 | 92 KB |
| Noto Sans Telugu | Telugu | Telugu | 400, 700 | 88 KB |
| Noto Sans Kannada | Kannada | Kannada | 400, 700 | 68 KB |
| Noto Sans Malayalam | Malayalam | Malayalam | 400, 700 | 60 KB |
| Noto Sans Tamil | Tamil | Tamil | 400, 700 | 44 KB |
| Noto Sans Gurmukhi | Gurmukhi | Punjabi | 400, 700 | 36 KB |

Twelve languages, ten families: Hindi and Marathi share Devanagari, and
Bengali and Assamese share the Bengali script.

**840 KB in total** — but no visitor downloads anything like that. See below.

---

## Why Noto, and why not a single variable font

The Noto project exists to cover every script with one coherent design, so the
nine Indic families share stroke weight, x-height and proportions. Pairing them
with Inter — a neutral grotesque of similar proportion — means the portal looks
like one product in Tamil and in English, rather than two different sites.

The alternative, a single large variable font covering all scripts, would mean
every visitor downloads every script whether they read it or not. For a portal
aimed at citizens on slow connections, that is the wrong trade.

---

## Loading: `unicode-range` does the work

Each `@font-face` in [`fonts.css`](../assets/css/fonts.css) declares the exact
Unicode block it serves:

```css
@font-face {
  font-family: "Noto Sans Kannada";
  font-weight: 400;
  font-display: swap;
  src: url("../fonts/noto-sans-kannada/noto-sans-kannada-kannada-400-normal.woff2") format("woff2");
  unicode-range: U+0C80-0CF3, U+0964-0965, U+200C-200D, U+20B9, U+25CC, …;
}
```

The browser fetches a face **only if the page actually contains a character in
its range**. So:

- An English page downloads Inter 400 alone — about **24 KB**
- Switching to Kannada adds one 28 KB file, on demand
- Nobody ever downloads all ten families

`font-display: swap` renders fallback text immediately rather than leaving a
blank page while a font loads — on a slow connection, text that arrives in a
system font beats no text at all.

Everything is **self-hosted**. No Google Fonts CDN, no third-party request. The
repository is reproducible offline, and a citizen behind a filtered connection
still gets the right script.

---

## The font stack

```css
--font-sans:
  "Inter",
  "Noto Sans Devanagari", "Noto Sans Kannada", "Noto Sans Telugu",
  "Noto Sans Tamil",      "Noto Sans Malayalam", "Noto Sans Bengali",
  "Noto Sans Gujarati",   "Noto Sans Gurmukhi",  "Noto Sans Oriya",
  system-ui, -apple-system, "Segoe UI", sans-serif;
```

**Order matters, and the mechanism is per-character.** The browser resolves
each character against the stack in turn, not the string as a whole. So a
sentence mixing scripts — a Hindi service name inside an English page, or an
English acronym inside a Tamil sentence — picks the right family for every
glyph without any markup.

Inter is first because it carries Latin, which appears on every page regardless
of the chosen language. The Indic ranges do not overlap with Latin, so there is
no competition.

The Indic subsets *do* overlap each other on shared punctuation — the danda
(U+0964), the rupee sign (U+20B9), the dotted circle (U+25CC), zero-width
joiners. Whichever family comes first in the stack wins those. They are visually
near-identical across Noto families, so it does not matter in practice. Google
Fonts resolves it the same way.

---

## Sizes and line height

The scale is a 1.250 major third from a 16px base. Full table in
[design-tokens.md](design-tokens.md).

Two decisions are driven specifically by the Indic scripts:

**Nothing below 13px.** Devanagari and Bengali carry vowel marks above and
below the baseline. At 11–12px those marks start to merge with the letterform
on a standard-density screen. A Latin-only design could go smaller.

**Body line height is 1.6, not 1.5.** WCAG asks for 1.5. Devanagari conjuncts
and Bengali's hanging *matra* line need the extra room; at 1.5 the ascenders of
one line start to crowd the descenders of the one above.

```css
body {
  line-height: var(--lh-body);  /* 1.6 */
  text-rendering: optimizeLegibility;
}
```

`text-rendering: optimizeLegibility` matters more here than in a Latin-only
site: Indic scripts depend on ligature and mark-positioning tables to form
conjuncts correctly, and this keeps the renderer doing that shaping work.

Line heights are **unitless** so they inherit as a ratio. A unit value would
force the same absolute leading on a 40px heading as on 13px caption text.

---

## `lang` attributes

Switching language sets `document.documentElement.lang`. Individual elements
showing a language different from the page — the twelve tiles on
`language.html`, the chips on the landing page — carry their own `lang`:

```html
<button class="lang-tile" data-lang="kn" lang="kn">
  <span class="lang-tile__native">ಕನ್ನಡ</span>
  <span class="lang-tile__latin" lang="en">Kannada</span>
</button>
```

This is not decoration. It tells a screen reader which voice and pronunciation
rules to use, and it satisfies WCAG 3.1.2 (Language of Parts). Without it, a
screen reader reads Kannada text with English phonetics — unintelligible.

---

## Endonyms

The language picker shows each language **in its own script first**, with the
English name underneath:

> **ಕನ್ನಡ**
> Kannada

Someone who cannot read Latin script still has to be able to find their own
language. Showing only "Kannada" in Latin makes the language picker — the one
screen that must work before anything else does — unusable for exactly the
people it exists for.

---

## Licensing

Inter and all Noto families are **SIL Open Font License 1.1**, which permits
redistribution inside this repository. A copy of each licence sits beside the
font files in `assets/fonts/<family>/LICENSE`.
