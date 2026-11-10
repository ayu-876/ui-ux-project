/* ==========================================================================
   JanSeva AI — Interaction layer

   Plain ES2015+, no framework, no build step. Every behaviour below is
   progressive: the pages are navigable and readable with JavaScript off,
   and this file only adds convenience on top.

   Each init function exits quietly when its markup is absent, so one
   script can serve all nine pages.
   ========================================================================== */

(function () {
  "use strict";

  /* ---- Mobile navigation ------------------------------------------------
     The button owns aria-expanded and the menu owns `hidden`, so assistive
     tech is told the state rather than inferring it from CSS.            */
  function initNavToggle() {
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.getElementById("site-nav");
    if (!toggle || !nav) return;

    const mobile = window.matchMedia("(max-width: 47.999rem)");

    function sync() {
      /* Above the breakpoint the menu is always visible, and `hidden`
         must come off or CSS cannot override it. */
      if (mobile.matches) {
        nav.hidden = toggle.getAttribute("aria-expanded") !== "true";
      } else {
        nav.hidden = false;
      }
    }

    toggle.addEventListener("click", function () {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      sync();
    });

    /* Escape closes the menu and returns focus to the button that opened
       it, so a keyboard user is never stranded inside a closed menu. */
    nav.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && mobile.matches) {
        toggle.setAttribute("aria-expanded", "false");
        sync();
        toggle.focus();
      }
    });

    mobile.addEventListener("change", sync);
    toggle.setAttribute("aria-expanded", "false");
    sync();
  }

  /* ---- Language picker --------------------------------------------------
     Tiles are buttons carrying aria-pressed, not links, because choosing a
     language changes the current page rather than navigating away.       */
  function initLanguagePicker() {
    const tiles = document.querySelectorAll(".lang-tile");
    if (!tiles.length) return;

    tiles.forEach(function (tile) {
      tile.addEventListener("click", function () {
        applyLanguage(tile.dataset.lang);
        announce(tile.dataset.lang);
      });
    });
  }

  /* Tell a screen reader the language changed. The live region is polite,
     so it waits for a gap rather than cutting across whatever is being
     read out. */
  function announce(code) {
    const region = document.getElementById("live-region");
    if (!region) return;
    const lang = LANGUAGES.find(function (l) { return l.code === code; });
    region.textContent = lang ? "Language set to " + lang.latin : "";
  }

  /* ---- Glossary disclosure ---------------------------------------------
     One term open at a time, each trigger a real <button> inside a heading
     so the terms are still a navigable list of headings.                 */
  function initGlossary() {
    const triggers = document.querySelectorAll(".term__trigger");
    if (!triggers.length) return;

    triggers.forEach(function (trigger) {
      trigger.addEventListener("click", function () {
        const panel = document.getElementById(trigger.getAttribute("aria-controls"));
        const open = trigger.getAttribute("aria-expanded") === "true";

        triggers.forEach(function (other) {
          const otherPanel = document.getElementById(other.getAttribute("aria-controls"));
          other.setAttribute("aria-expanded", "false");
          if (otherPanel) otherPanel.hidden = true;
        });

        if (!open) {
          trigger.setAttribute("aria-expanded", "true");
          if (panel) panel.hidden = false;
        }
      });
    });
  }

  /* ---- Glossary search -------------------------------------------------
     Filters in place and reports the count to the live region, so someone
     who cannot see the list shrink still learns how many matches there
     are. */
  function initGlossarySearch() {
    const input = document.getElementById("term-search");
    const items = document.querySelectorAll(".terms > .term");
    const status = document.getElementById("term-count");
    if (!input || !items.length) return;

    input.addEventListener("input", function () {
      const query = input.value.trim().toLowerCase();
      let shown = 0;

      items.forEach(function (item) {
        const match = item.dataset.term.toLowerCase().indexOf(query) !== -1;
        item.hidden = !match;
        if (match) shown += 1;
      });

      if (status) {
        status.textContent = query
          ? shown + (shown === 1 ? " term matches" : " terms match")
          : items.length + " terms";
      }
    });
  }

  /* ---- Assistant -------------------------------------------------------
     Appends the question, then a canned reply. No network call: the point
     of the prototype is the shape of the exchange, not the model.        */
  function initAssistant() {
    const form = document.getElementById("assistant-form");
    const input = document.getElementById("assistant-input");
    const log = document.getElementById("chat-log");
    if (!form || !input || !log) return;

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const question = input.value.trim();
      if (!question) return;

      log.appendChild(userMessage(question));
      log.appendChild(botMessage(lookupReply(question)));
      input.value = "";
      input.focus();
    });

    /* Suggestion chips ask on the citizen's behalf. */
    document.querySelectorAll("[data-ask]").forEach(function (chip) {
      chip.addEventListener("click", function () {
        input.value = chip.dataset.ask;
        form.dispatchEvent(new Event("submit"));
      });
    });
  }

  function lookupReply(question) {
    const q = question.toLowerCase();
    const key = Object.keys(ASSISTANT_REPLIES).find(function (k) {
      return q.indexOf(k) !== -1;
    });
    return key ? ASSISTANT_REPLIES[key] : ASSISTANT_FALLBACK;
  }

  function userMessage(text) {
    const wrap = document.createElement("div");
    wrap.className = "chat__msg chat__msg--user";
    const bubble = document.createElement("div");
    bubble.className = "chat__bubble";
    const p = document.createElement("p");
    p.textContent = text;
    bubble.appendChild(p);
    wrap.appendChild(bubble);
    return wrap;
  }

  function botMessage(reply) {
    const wrap = document.createElement("div");
    wrap.className = "chat__msg";

    const avatar = document.createElement("div");
    avatar.className = "chat__avatar";
    avatar.setAttribute("aria-hidden", "true");
    avatar.textContent = "AI";

    const bubble = document.createElement("div");
    bubble.className = "chat__bubble";

    const p = document.createElement("p");
    const term = document.createElement("span");
    term.className = "chat__term";
    term.textContent = reply.term;
    p.appendChild(term);
    /* textContent, never innerHTML — a citizen's question is untrusted
       input and must never become markup. */
    p.appendChild(document.createTextNode(" " + reply.body));
    bubble.appendChild(p);

    if (reply.example) {
      const eg = document.createElement("p");
      eg.className = "term__example";
      eg.textContent = "Example: " + reply.example;
      bubble.appendChild(eg);
    }

    wrap.appendChild(avatar);
    wrap.appendChild(bubble);
    return wrap;
  }

  /* ---- Service search --------------------------------------------------- */
  function initServiceSearch() {
    const input = document.getElementById("service-search");
    const cards = document.querySelectorAll("[data-service]");
    const status = document.getElementById("service-count");
    if (!input || !cards.length) return;

    input.addEventListener("input", function () {
      const query = input.value.trim().toLowerCase();
      let shown = 0;

      cards.forEach(function (card) {
        const match = card.dataset.service.toLowerCase().indexOf(query) !== -1;
        card.hidden = !match;
        if (match) shown += 1;
      });

      if (status) {
        status.textContent = shown + (shown === 1 ? " service" : " services");
      }
    });
  }

  /* ---- Form validation -------------------------------------------------
     The browser's own constraint validation does the checking; this only
     replaces the native bubble with a message that stays on screen, names
     the problem in words, and moves focus to the first bad field.        */
  function initForm() {
    const form = document.getElementById("application-form");
    if (!form) return;

    form.addEventListener("submit", function (event) {
      let firstBad = null;

      form.querySelectorAll("input, select, textarea").forEach(function (field) {
        const wrap = field.closest(".field");
        const error = wrap ? wrap.querySelector(".field__error") : null;
        const ok = field.checkValidity();

        if (wrap) wrap.classList.toggle("field--error", !ok);
        field.setAttribute("aria-invalid", String(!ok));

        if (error) {
          error.hidden = ok;
          /* Write into the inner span, not the wrapper: the wrapper also
             holds the warning icon, which textContent on it would erase. */
          const text = error.querySelector(".field__error-text");
          if (!ok && text) text.textContent = messageFor(field);
        }

        if (!ok && !firstBad) firstBad = field;
      });

      if (firstBad) {
        event.preventDefault();
        firstBad.focus();
      }
    });
  }

  function messageFor(field) {
    const label = field.dataset.label || "This field";
    if (field.validity.valueMissing) return label + " is required.";
    if (field.validity.patternMismatch) return field.dataset.pattern || label + " is not in the expected format.";
    if (field.validity.tooShort) return label + " is too short.";
    return label + " is not valid.";
  }

  /* ---- Boot -------------------------------------------------------------
     DOMContentLoaded rather than `load`, so nothing waits on fonts.      */
  document.addEventListener("DOMContentLoaded", function () {
    if (typeof applyDemoUser === "function") applyDemoUser();
    if (typeof applyLanguage === "function") applyLanguage(currentLanguage());

    initNavToggle();
    initLanguagePicker();
    initGlossary();
    initGlossarySearch();
    initAssistant();
    initServiceSearch();
    initForm();
  });
})();
