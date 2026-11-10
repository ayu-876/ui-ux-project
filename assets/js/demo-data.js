/* ==========================================================================
   JanSeva AI — Demo data

   This is a front-end prototype with no backend. Everything a real build
   would fetch from FastAPI, Firebase or Groq is stated here instead, in one
   place, so there is exactly one file to change when wiring up the API.

   CHANGE THE DEMO CITIZEN HERE. The name and initial below are what the
   dashboard greeting, the avatar and the profile page display.
   ========================================================================== */

const DEMO_USER = {
  name: "Ayush Behera",
  firstName: "Ayush",
  initial: "A",
  email: "ayush@example.com",
  role: "Citizen",
  memberSince: "Oct 2025"
};

/* Canned assistant replies, keyed by the term the citizen asks about. In the
   real system this is a Groq call with the glossary passed as context; the
   shape of the answer (plain definition, then an example) is the part worth
   fixing in the prototype, because that is the UX decision under test. */
const ASSISTANT_REPLIES = {
  "self-attested": {
    term: "Self-attested",
    body:
      "means you take a photocopy of your document and sign it yourself to " +
      "confirm it is a true copy. You do not need a notary or a gazetted " +
      "officer for this.",
    example: "Photocopy your Aadhaar card, then sign across the bottom of the copy."
  },
  affidavit: {
    term: "Affidavit",
    body:
      "is a written statement you swear is true, signed in front of an " +
      "authorised officer. It is used when you have no document to prove " +
      "something.",
    example: "If your name is spelled differently on two documents, an affidavit explains which is correct."
  },
  domicile: {
    term: "Domicile Certificate",
    body:
      "is a document that proves you permanently reside in a particular " +
      "state or region.",
    example: "It is often required for state government schemes and for state quota college admissions."
  },
  "annual family income": {
    term: "Annual Family Income",
    body:
      "is the total money earned in one year by everyone in your household " +
      "put together, not just you.",
    example: "If you earn ₹2,00,000 and your mother earns ₹1,00,000, your annual family income is ₹3,00,000."
  },
  beneficiary: {
    term: "Beneficiary",
    body: "is the person who receives the money or benefit from a scheme.",
    example: "In a scholarship, the student is the beneficiary."
  }
};

/* A reply used when the question does not match any known term. It says
   plainly that it does not know rather than inventing an answer — getting
   a confident wrong answer from a government portal is worse than getting
   none, which is exactly what testing on the glossary flow showed. */
const ASSISTANT_FALLBACK = {
  term: "Sorry",
  body:
    "I do not have a simple explanation for that yet. Try the Glossary, or " +
    "ask about a term you saw on a form.",
  example: null
};

const ASSISTANT_REPLY_KEYS = {
  "self-attested": {
    id: "self-attested",
    termKey: "glossary.t3.term",
    bodyKey: "asst.reply.selfAttested.body",
    exKey: "asst.reply.selfAttested.ex"
  },
  affidavit: {
    id: "affidavit",
    termKey: "glossary.t2.term",
    bodyKey: "asst.reply.affidavit.body",
    exKey: "asst.reply.affidavit.ex"
  },
  domicile: {
    id: "domicile",
    termKey: "glossary.t1.term",
    bodyKey: "asst.reply.domicile.body",
    exKey: "asst.reply.domicile.ex"
  },
  "annual family income": {
    id: "annual family income",
    termKey: "glossary.t4.term",
    bodyKey: "asst.reply.income.body",
    exKey: "asst.reply.income.ex"
  },
  beneficiary: {
    id: "beneficiary",
    termKey: "glossary.t5.term",
    bodyKey: "asst.reply.beneficiary.body",
    exKey: "asst.reply.beneficiary.ex"
  }
};

function getAssistantReply(key, code) {
  const entry = ASSISTANT_REPLY_KEYS[key];
  if (!entry) return getAssistantFallback(code);
  if (typeof translate === "function") {
    return {
      id: entry.id,
      term: translate(entry.termKey, code),
      body: translate(entry.bodyKey, code),
      example: translate(entry.exKey, code)
    };
  }
  return ASSISTANT_REPLIES[key] || ASSISTANT_FALLBACK;
}

function getAssistantFallback(code) {
  if (typeof translate === "function") {
    return {
      id: "fallback",
      term: translate("asst.fallback.term", code),
      body: translate("asst.fallback.body", code),
      example: null
    };
  }
  return ASSISTANT_FALLBACK;
}

/* Populate every element marked with a demo-user field. */
function applyDemoUser() {
  const map = {
    name: DEMO_USER.name,
    firstName: DEMO_USER.firstName,
    initial: DEMO_USER.initial,
    email: DEMO_USER.email,
    role: DEMO_USER.role,
    memberSince: DEMO_USER.memberSince
  };

  document.querySelectorAll("[data-user]").forEach(function (el) {
    if (el.dataset.i18n) return;
    const value = map[el.dataset.user];
    if (value) el.textContent = value;
  });
}
