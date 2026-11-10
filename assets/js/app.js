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

  /* ---- Language picker (landing chips & language.html tiles) ------------ */
  function initLanguagePicker() {
    const controls = document.querySelectorAll(".lang-tile, .lang-chip");
    if (!controls.length) return;

    controls.forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyLanguage(btn.dataset.lang);
        announce(btn.dataset.lang);
      });
    });
  }

  /* ---- Header language dropdown -----------------------------------------
     Enhances .lang-switch into an inline 12-language menu while keeping
     href="language.html" as the fallback with JavaScript off.            */
  function initLanguageDropdown() {
    const switches = document.querySelectorAll(".lang-switch");
    if (!switches.length || typeof LANGUAGES === "undefined") return;

    const menus = [];

    function closeAll(restoreFocus) {
      menus.forEach(function (entry) {
        if (!entry.menu.hidden) {
          entry.menu.hidden = true;
          entry.trigger.setAttribute("aria-expanded", "false");
          if (restoreFocus) entry.trigger.focus();
        }
      });
    }

    switches.forEach(function (trigger, idx) {
      const wrap = document.createElement("div");
      wrap.className = "lang-menu-wrap";
      trigger.parentNode.insertBefore(wrap, trigger);
      wrap.appendChild(trigger);

      const menuId = "lang-menu-" + idx;
      const menu = document.createElement("div");
      menu.className = "lang-menu";
      menu.id = menuId;
      menu.setAttribute("role", "menu");
      menu.hidden = true;

      const active = currentLanguage();
      LANGUAGES.forEach(function (lang) {
        const item = document.createElement("button");
        item.type = "button";
        item.className = "lang-menu__item";
        item.setAttribute("role", "menuitemradio");
        item.setAttribute("aria-checked", String(lang.code === active));
        item.dataset.lang = lang.code;
        item.lang = lang.code;

        const nativeSpan = document.createElement("span");
        nativeSpan.textContent = lang.native;
        item.appendChild(nativeSpan);

        if (lang.latin !== lang.native) {
          const latinSpan = document.createElement("span");
          latinSpan.className = "lang-menu__latin";
          latinSpan.lang = "en";
          latinSpan.textContent = lang.latin;
          item.appendChild(latinSpan);
        }

        item.addEventListener("click", function () {
          applyLanguage(lang.code);
          announce(lang.code);
          closeAll(false);
          trigger.focus();
        });

        menu.appendChild(item);
      });

      wrap.appendChild(menu);
      trigger.setAttribute("aria-haspopup", "true");
      trigger.setAttribute("aria-expanded", "false");
      trigger.setAttribute("aria-controls", menuId);

      menus.push({ trigger: trigger, menu: menu, wrap: wrap });

      trigger.addEventListener("click", function (event) {
        event.preventDefault();
        const willOpen = menu.hidden;
        closeAll(false);
        if (willOpen) {
          menu.hidden = false;
          trigger.setAttribute("aria-expanded", "true");
          if (event.detail === 0) {
            const checked = menu.querySelector('[aria-checked="true"]') || menu.firstElementChild;
            if (checked) checked.focus();
          }
        }
      });

      menu.addEventListener("keydown", function (event) {
        const items = Array.prototype.slice.call(menu.querySelectorAll(".lang-menu__item"));
        const i = items.indexOf(document.activeElement);
        if (event.key === "Escape") {
          event.preventDefault();
          closeAll(true);
        } else if (event.key === "ArrowDown") {
          event.preventDefault();
          items[(i + 1) % items.length].focus();
        } else if (event.key === "ArrowUp") {
          event.preventDefault();
          items[(i - 1 + items.length) % items.length].focus();
        }
      });
    });

    document.addEventListener("click", function (event) {
      const inside = menus.some(function (entry) {
        return entry.wrap.contains(event.target);
      });
      if (!inside) closeAll(false);
    });
  }

  /* Tell a screen reader the language changed. The live region is polite,
     so it waits for a gap rather than cutting across whatever is being
     read out. */
  function announce(code) {
    const region = document.getElementById("live-region");
    if (!region) return;
    const lang = LANGUAGES.find(function (l) { return l.code === code; });
    if (!lang) {
      region.textContent = "";
      return;
    }
    region.textContent = typeof formatMessage === "function"
      ? formatMessage("a11y.langChanged", code, { lang: lang.native })
      : "Language set to " + lang.latin;
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

    function updateGlossaryFilter() {
      const query = input.value.trim().toLowerCase();
      let shown = 0;

      items.forEach(function (item) {
        const hay = (item.dataset.term + " " + item.textContent).toLowerCase();
        const match = !query || hay.indexOf(query) !== -1;
        item.hidden = !match;
        if (match) shown += 1;
      });

      if (status) {
        const code = currentLanguage();
        if (!query) {
          status.textContent = formatMessage("glossary.countAll", code, { n: items.length });
        } else {
          const key = shown === 1 ? "glossary.countOne" : "glossary.countMany";
          status.textContent = formatMessage(key, code, { n: shown });
        }
      }
    }

    input.addEventListener("input", updateGlossaryFilter);
    document.addEventListener("janseva:languagechange", updateGlossaryFilter);
    updateGlossaryFilter();
  }

  /* ---- Assistant -------------------------------------------------------
     Appends the question, then a canned reply in the active language.    */
  function initAssistant() {
    const form = document.getElementById("assistant-form");
    const input = document.getElementById("assistant-input");
    const log = document.getElementById("chat-log");
    if (!form || !input || !log) return;

    let pendingReplyKey = null;

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const question = input.value.trim();
      if (!question) return;

      const code = currentLanguage();
      const key = pendingReplyKey || lookupReplyKey(question);
      pendingReplyKey = null;

      const reply = typeof getAssistantReply === "function"
        ? getAssistantReply(key, code)
        : ASSISTANT_FALLBACK;

      log.appendChild(userMessage(question));
      log.appendChild(botMessage(reply, code));
      input.value = "";
      input.focus();
    });

    /* Suggestion chips ask on the citizen's behalf in the active language. */
    document.querySelectorAll("[data-reply-key], [data-ask]").forEach(function (chip) {
      chip.addEventListener("click", function () {
        input.value = chip.textContent.trim() || chip.dataset.ask || "";
        pendingReplyKey = chip.dataset.replyKey || null;
        form.dispatchEvent(new Event("submit"));
      });
    });

    document.addEventListener("janseva:languagechange", function (event) {
      const code = event.detail.code;
      log.querySelectorAll("[data-reply-id]").forEach(function (msg) {
        const reply = getAssistantReply(msg.dataset.replyId, code);
        fillBotBubble(msg.querySelector(".chat__bubble"), reply, code);
      });
    });
  }

  function lookupReplyKey(question) {
    const q = question.toLowerCase();
    const keys = Object.keys(ASSISTANT_REPLY_KEYS);

    const direct = keys.find(function (k) {
      return q.indexOf(k) !== -1;
    });
    if (direct) return direct;

    /* Also match against localized term names across all 12 languages. */
    if (typeof STRINGS === "object") {
      for (let i = 0; i < keys.length; i += 1) {
        const entry = ASSISTANT_REPLY_KEYS[keys[i]];
        const matched = Object.keys(STRINGS).some(function (langCode) {
          const term = (STRINGS[langCode][entry.termKey] || "").toLowerCase();
          return term && q.indexOf(term) !== -1;
        });
        if (matched) return entry.id;
      }
    }
    return null;
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

  function fillBotBubble(bubble, reply, code) {
    if (!bubble) return;
    while (bubble.firstChild) bubble.removeChild(bubble.firstChild);

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
      const prefix = typeof translate === "function"
        ? translate("glossary.examplePrefix", code)
        : "Example: ";
      eg.textContent = prefix + reply.example;
      bubble.appendChild(eg);
    }
  }

  function botMessage(reply, code) {
    const wrap = document.createElement("div");
    wrap.className = "chat__msg";
    if (reply.id) wrap.dataset.replyId = reply.id;

    const avatar = document.createElement("div");
    avatar.className = "chat__avatar";
    avatar.setAttribute("aria-hidden", "true");
    avatar.textContent = "AI";

    const bubble = document.createElement("div");
    bubble.className = "chat__bubble";
    fillBotBubble(bubble, reply, code);

    wrap.appendChild(avatar);
    wrap.appendChild(bubble);
    return wrap;
  }

  /* ---- Service search & category filter -------------------------------- */
  function initServiceSearch() {
    const input = document.getElementById("service-search");
    const cards = document.querySelectorAll("[data-service]");
    const status = document.getElementById("service-count");
    const catLinks = document.querySelectorAll("[data-cat]");
    if (!cards.length) return;

    let activeCat = "all";

    function updateServices() {
      const query = input ? input.value.trim().toLowerCase() : "";
      let shown = 0;

      cards.forEach(function (card) {
        const cats = (card.dataset.cats || "").split(",");
        const catOk = activeCat === "all" || cats.indexOf(activeCat) !== -1;
        const hay = (card.dataset.service + " " + card.textContent).toLowerCase();
        const searchOk = !query || hay.indexOf(query) !== -1;
        const match = catOk && searchOk;
        card.hidden = !match;
        if (match) shown += 1;
      });

      if (status) {
        const code = currentLanguage();
        const key = shown === 1 ? "services.countOne" : "services.countMany";
        status.textContent = formatMessage(key, code, { n: shown });
      }
    }

    if (input) input.addEventListener("input", updateServices);

    catLinks.forEach(function (link) {
      link.addEventListener("click", function (event) {
        event.preventDefault();
        activeCat = link.dataset.cat || "all";
        catLinks.forEach(function (other) {
          if (other === link) other.setAttribute("aria-current", "true");
          else other.removeAttribute("aria-current");
        });
        updateServices();
      });
    });

    document.addEventListener("janseva:languagechange", updateServices);
    updateServices();
  }

  /* ---- Form validation -------------------------------------------------
     The browser's own constraint validation does the checking; this only
     replaces the native bubble with a message that stays on screen, names
     the problem in words, and moves focus to the first bad field.        */
  function initForm() {
    const form = document.getElementById("application-form");
    if (!form) return;

    function validateField(field, code) {
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
        if (!ok && text) text.textContent = messageFor(field, code);
      }

      return ok;
    }

    form.addEventListener("submit", function (event) {
      let firstBad = null;
      const code = currentLanguage();

      form.querySelectorAll("input, select, textarea").forEach(function (field) {
        const ok = validateField(field, code);
        if (!ok && !firstBad) firstBad = field;
      });

      if (firstBad) {
        event.preventDefault();
        firstBad.focus();
      }
    });

    document.addEventListener("janseva:languagechange", function (event) {
      const code = event.detail.code;
      form.querySelectorAll("input, select, textarea").forEach(function (field) {
        if (field.getAttribute("aria-invalid") === "true") {
          validateField(field, code);
        }
      });
    });
  }

  function messageFor(field, code) {
    const label = field.dataset.labelKey
      ? translate(field.dataset.labelKey, code)
      : (field.dataset.label || "This field");
    if (field.validity.valueMissing) return formatMessage("err.required", code, { label: label });
    if (field.validity.patternMismatch) {
      if (field.dataset.patternKey) return translate(field.dataset.patternKey, code);
      return field.dataset.pattern || formatMessage("err.pattern", code, { label: label });
    }
    if (field.validity.tooShort) return formatMessage("err.tooShort", code, { label: label });
    return formatMessage("err.invalid", code, { label: label });
  }

  /* ---- Boot -------------------------------------------------------------
     DOMContentLoaded rather than `load`, so nothing waits on fonts.      */
  document.addEventListener("DOMContentLoaded", function () {
    if (typeof applyDemoUser === "function") applyDemoUser();
    if (typeof applyLanguage === "function") applyLanguage(currentLanguage());

    initNavToggle();
    initLanguagePicker();
    initLanguageDropdown();
    initGlossary();
    initGlossarySearch();
    initAssistant();
    initServiceSearch();
    initForm();
  });

  window.addEventListener("pageshow", function (event) {
    if (!event.persisted) return;
    if (typeof applyDemoUser === "function") applyDemoUser();
    if (typeof applyLanguage === "function") applyLanguage(currentLanguage());
  });
})();
