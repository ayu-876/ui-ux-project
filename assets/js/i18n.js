/* ==========================================================================
   JanSeva AI — Language data and runtime string swapping

   HOW IT WORKS
   Any element carrying data-i18n="some.key" has its text replaced when the
   language changes. Placeholders use data-i18n-placeholder, and labels that
   only screen readers hear use data-i18n-label (-> aria-label).

   Changing the language also sets <html lang> and, where relevant, dir.
   That is what lets the font stack in tokens.css fall through to the right
   Noto Sans family, and what tells a screen reader which voice to use.

   SCOPE OF THE STRINGS BELOW
   These cover the application shell: navigation, primary actions and page
   titles. They are deliberately a small, high-confidence set. Service
   descriptions, legal definitions and form field copy are NOT translated
   here — in the real system those come from the content API, and every
   string needs review by a native speaker and a domain reviewer before it
   goes near a citizen. Untranslated keys fall back to English rather than
   showing a blank or a key name.
   ========================================================================== */

/* The twelve languages, in the order the picker shows them: English first,
   then by number of speakers. `native` is the endonym — the name of the
   language in its own script — because someone who cannot read Latin text
   still needs to find their own language in the list. */
const LANGUAGES = [
  { code: "en", native: "English",   latin: "English",   script: "latin" },
  { code: "hi", native: "हिंदी",      latin: "Hindi",     script: "devanagari" },
  { code: "bn", native: "বাংলা",      latin: "Bengali",   script: "bengali" },
  { code: "mr", native: "मराठी",      latin: "Marathi",   script: "devanagari" },
  { code: "te", native: "తెలుగు",     latin: "Telugu",    script: "telugu" },
  { code: "ta", native: "தமிழ்",      latin: "Tamil",     script: "tamil" },
  { code: "gu", native: "ગુજરાતી",    latin: "Gujarati",  script: "gujarati" },
  { code: "kn", native: "ಕನ್ನಡ",      latin: "Kannada",   script: "kannada" },
  { code: "ml", native: "മലയാളം",    latin: "Malayalam", script: "malayalam" },
  { code: "pa", native: "ਪੰਜਾਬੀ",     latin: "Punjabi",   script: "gurmukhi" },
  { code: "or", native: "ଓଡ଼ିଆ",       latin: "Odia",      script: "oriya" },
  { code: "as", native: "অসমীয়া",    latin: "Assamese",  script: "bengali" }
];

const STRINGS = {
  en: {
    "nav.home": "Home",
    "nav.services": "Services",
    "nav.help": "Help",
    "nav.about": "About",
    "action.login": "Login",
    "action.continue": "Continue",
    "action.explore": "Explore Services",
    "action.search": "Search",
    "action.apply": "Apply",
    "nav.dashboard": "Dashboard",
    "nav.assistant": "AI Assistant",
    "nav.glossary": "Glossary",
    "lang.heading": "Choose Your Language",
    "lang.switch": "Change language"
  },
  hi: {
    "nav.home": "मुख्य पृष्ठ",
    "nav.services": "सेवाएँ",
    "nav.help": "सहायता",
    "nav.about": "हमारे बारे में",
    "action.login": "लॉगिन",
    "action.continue": "आगे बढ़ें",
    "action.explore": "सेवाएँ देखें",
    "action.search": "खोजें",
    "action.apply": "आवेदन करें",
    "nav.dashboard": "डैशबोर्ड",
    "nav.assistant": "एआई सहायक",
    "nav.glossary": "शब्दावली",
    "lang.heading": "अपनी भाषा चुनें",
    "lang.switch": "भाषा बदलें"
  },
  bn: {
    "nav.home": "হোম",
    "nav.services": "পরিষেবা",
    "nav.help": "সহায়তা",
    "nav.about": "আমাদের সম্পর্কে",
    "action.login": "লগইন",
    "action.continue": "চালিয়ে যান",
    "action.explore": "পরিষেবা দেখুন",
    "action.search": "খোঁজ করুন",
    "action.apply": "আবেদন করুন",
    "nav.dashboard": "ড্যাশবোর্ড",
    "nav.assistant": "এআই সহায়ক",
    "nav.glossary": "শব্দকোষ",
    "lang.heading": "আপনার ভাষা বেছে নিন",
    "lang.switch": "ভাষা পরিবর্তন করুন"
  },
  mr: {
    "nav.home": "मुख्यपृष्ठ",
    "nav.services": "सेवा",
    "nav.help": "मदत",
    "nav.about": "आमच्याविषयी",
    "action.login": "लॉगिन",
    "action.continue": "पुढे जा",
    "action.explore": "सेवा पहा",
    "action.search": "शोधा",
    "action.apply": "अर्ज करा",
    "nav.dashboard": "डॅशबोर्ड",
    "nav.assistant": "एआय सहायक",
    "nav.glossary": "शब्दसूची",
    "lang.heading": "तुमची भाषा निवडा",
    "lang.switch": "भाषा बदला"
  },
  te: {
    "nav.home": "హోమ్",
    "nav.services": "సేవలు",
    "nav.help": "సహాయం",
    "nav.about": "మా గురించి",
    "action.login": "లాగిన్",
    "action.continue": "కొనసాగించు",
    "action.explore": "సేవలను చూడండి",
    "action.search": "వెతకండి",
    "action.apply": "దరఖాస్తు చేయండి",
    "nav.dashboard": "డాష్‌బోర్డ్",
    "nav.assistant": "ఏఐ సహాయకుడు",
    "nav.glossary": "పదకోశం",
    "lang.heading": "మీ భాషను ఎంచుకోండి",
    "lang.switch": "భాష మార్చండి"
  },
  ta: {
    "nav.home": "முகப்பு",
    "nav.services": "சேவைகள்",
    "nav.help": "உதவி",
    "nav.about": "எங்களைப் பற்றி",
    "action.login": "உள்நுழைவு",
    "action.continue": "தொடரவும்",
    "action.explore": "சேவைகளைப் பார்க்க",
    "action.search": "தேடு",
    "action.apply": "விண்ணப்பிக்க",
    "nav.dashboard": "டாஷ்போர்டு",
    "nav.assistant": "ஏஐ உதவியாளர்",
    "nav.glossary": "சொற்களஞ்சியம்",
    "lang.heading": "உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்",
    "lang.switch": "மொழியை மாற்று"
  },
  gu: {
    "nav.home": "મુખ્ય પૃષ્ઠ",
    "nav.services": "સેવાઓ",
    "nav.help": "મદદ",
    "nav.about": "અમારા વિશે",
    "action.login": "લોગિન",
    "action.continue": "આગળ વધો",
    "action.explore": "સેવાઓ જુઓ",
    "action.search": "શોધો",
    "action.apply": "અરજી કરો",
    "nav.dashboard": "ડેશબોર્ડ",
    "nav.assistant": "એઆઈ સહાયક",
    "nav.glossary": "શબ્દકોશ",
    "lang.heading": "તમારી ભાષા પસંદ કરો",
    "lang.switch": "ભાષા બદલો"
  },
  kn: {
    "nav.home": "ಮುಖಪುಟ",
    "nav.services": "ಸೇವೆಗಳು",
    "nav.help": "ಸಹಾಯ",
    "nav.about": "ನಮ್ಮ ಬಗ್ಗೆ",
    "action.login": "ಲಾಗಿನ್",
    "action.continue": "ಮುಂದುವರಿಸಿ",
    "action.explore": "ಸೇವೆಗಳನ್ನು ನೋಡಿ",
    "action.search": "ಹುಡುಕಿ",
    "action.apply": "ಅರ್ಜಿ ಸಲ್ಲಿಸಿ",
    "nav.dashboard": "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    "nav.assistant": "ಎಐ ಸಹಾಯಕ",
    "nav.glossary": "ಪದಕೋಶ",
    "lang.heading": "ನಿಮ್ಮ ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ",
    "lang.switch": "ಭಾಷೆ ಬದಲಿಸಿ"
  },
  ml: {
    "nav.home": "ഹോം",
    "nav.services": "സേവനങ്ങൾ",
    "nav.help": "സഹായം",
    "nav.about": "ഞങ്ങളെക്കുറിച്ച്",
    "action.login": "ലോഗിൻ",
    "action.continue": "തുടരുക",
    "action.explore": "സേവനങ്ങൾ കാണുക",
    "action.search": "തിരയുക",
    "action.apply": "അപേക്ഷിക്കുക",
    "nav.dashboard": "ഡാഷ്ബോർഡ്",
    "nav.assistant": "എഐ സഹായി",
    "nav.glossary": "പദസൂചി",
    "lang.heading": "നിങ്ങളുടെ ഭാഷ തിരഞ്ഞെടുക്കുക",
    "lang.switch": "ഭാഷ മാറ്റുക"
  },
  pa: {
    "nav.home": "ਮੁੱਖ ਪੰਨਾ",
    "nav.services": "ਸੇਵਾਵਾਂ",
    "nav.help": "ਮਦਦ",
    "nav.about": "ਸਾਡੇ ਬਾਰੇ",
    "action.login": "ਲਾਗਇਨ",
    "action.continue": "ਜਾਰੀ ਰੱਖੋ",
    "action.explore": "ਸੇਵਾਵਾਂ ਵੇਖੋ",
    "action.search": "ਖੋਜੋ",
    "action.apply": "ਅਰਜ਼ੀ ਦਿਓ",
    "nav.dashboard": "ਡੈਸ਼ਬੋਰਡ",
    "nav.assistant": "ਏਆਈ ਸਹਾਇਕ",
    "nav.glossary": "ਸ਼ਬਦਕੋਸ਼",
    "lang.heading": "ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ",
    "lang.switch": "ਭਾਸ਼ਾ ਬਦਲੋ"
  },
  or: {
    "nav.home": "ମୂଳ ପୃଷ୍ଠା",
    "nav.services": "ସେବାସମୂହ",
    "nav.help": "ସହାୟତା",
    "nav.about": "ଆମ ବିଷୟରେ",
    "action.login": "ଲଗଇନ୍",
    "action.continue": "ଆଗକୁ ବଢ଼ନ୍ତୁ",
    "action.explore": "ସେବା ଦେଖନ୍ତୁ",
    "action.search": "ଖୋଜନ୍ତୁ",
    "action.apply": "ଆବେଦନ କରନ୍ତୁ",
    "nav.dashboard": "ଡ୍ୟାସବୋର୍ଡ",
    "nav.assistant": "ଏଆଇ ସହାୟକ",
    "nav.glossary": "ଶବ୍ଦକୋଷ",
    "lang.heading": "ଆପଣଙ୍କ ଭାଷା ବାଛନ୍ତୁ",
    "lang.switch": "ଭାଷା ବଦଳାନ୍ତୁ"
  },
  as: {
    "nav.home": "মূল পৃষ্ঠা",
    "nav.services": "সেৱা",
    "nav.help": "সহায়",
    "nav.about": "আমাৰ বিষয়ে",
    "action.login": "লগিন",
    "action.continue": "আগবাঢ়ক",
    "action.explore": "সেৱা চাওক",
    "action.search": "সন্ধান কৰক",
    "action.apply": "আবেদন কৰক",
    "nav.dashboard": "ডেশব'ৰ্ড",
    "nav.assistant": "এআই সহায়ক",
    "nav.glossary": "শব্দকোষ",
    "lang.heading": "আপোনাৰ ভাষা বাছনি কৰক",
    "lang.switch": "ভাষা সলনি কৰক"
  }
};

const STORAGE_KEY = "janseva.lang";

/* localStorage throws in private-browsing and sandboxed contexts, so every
   access is guarded. A failure degrades to "language resets on reload",
   which is survivable; an uncaught throw would break the whole page. */
function readStoredLang() {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch (err) {
    return null;
  }
}

function writeStoredLang(code) {
  try {
    window.localStorage.setItem(STORAGE_KEY, code);
  } catch (err) {
    /* ignore — see above */
  }
}

function getLanguage(code) {
  return LANGUAGES.find(function (l) { return l.code === code; });
}

function translate(key, code) {
  var table = STRINGS[code] || {};
  /* English is the fallback, so a missing translation shows real words
     rather than a raw key. */
  return table[key] || STRINGS.en[key] || key;
}

function applyLanguage(code) {
  var lang = getLanguage(code);
  if (!lang) return;

  document.documentElement.lang = code;

  document.querySelectorAll("[data-i18n]").forEach(function (el) {
    el.textContent = translate(el.dataset.i18n, code);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
    el.placeholder = translate(el.dataset.i18nPlaceholder, code);
  });

  document.querySelectorAll("[data-i18n-label]").forEach(function (el) {
    el.setAttribute("aria-label", translate(el.dataset.i18nLabel, code));
  });

  /* The header chip always shows the endonym, never a translated label. */
  document.querySelectorAll("[data-lang-display]").forEach(function (el) {
    el.textContent = lang.native;
  });

  document.querySelectorAll(".lang-tile").forEach(function (el) {
    el.setAttribute("aria-pressed", String(el.dataset.lang === code));
  });

  writeStoredLang(code);
}

function currentLanguage() {
  return readStoredLang() || "en";
}
