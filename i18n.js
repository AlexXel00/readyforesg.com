(function () {
  function getNestedValue(obj, path) {
    return path.split(".").reduce((acc, key) => {
      if (acc && Object.prototype.hasOwnProperty.call(acc, key)) {
        return acc[key];
      }
      return undefined;
    }, obj);
  }

  function getCurrentLang() {
    const saved = localStorage.getItem("siteLang");
    if (saved && window.TRANSLATIONS && window.TRANSLATIONS[saved]) {
      return saved;
    }
    return "de";
  }

  function getPageName() {
    return document.body.dataset.page || "";
  }

  function translateElement(el, lang) {
    const page = getPageName();
    const key = el.dataset.i18n;

    if (!key) return;

    let value;

    value = getNestedValue(window.TRANSLATIONS[lang], key);

    if (value === undefined && page) {
      value = getNestedValue(window.TRANSLATIONS[lang], page + "." + key);
    }

    if (value === undefined) {
      value = getNestedValue(window.TRANSLATIONS["de"], key);
    }

    if (value === undefined && page) {
      value = getNestedValue(window.TRANSLATIONS["de"], page + "." + key);
    }

    if (value === undefined) return;

    if (el.dataset.i18nMode === "html") {
      el.innerHTML = value;
    } else {
      el.textContent = value;
    }
  }

  function translatePlaceholder(el, lang) {
    const page = getPageName();
    const key = el.dataset.i18nPlaceholder;

    if (!key) return;

    let value;

    value = getNestedValue(window.TRANSLATIONS[lang], key);

    if (value === undefined && page) {
      value = getNestedValue(window.TRANSLATIONS[lang], page + "." + key);
    }

    if (value === undefined) {
      value = getNestedValue(window.TRANSLATIONS["de"], key);
    }

    if (value === undefined && page) {
      value = getNestedValue(window.TRANSLATIONS["de"], page + "." + key);
    }

    if (value === undefined) return;

    el.setAttribute("placeholder", value);
  }

  function updateLangLabel(lang) {
    const labels = { de: "DE", en: "EN", fr: "FR", it: "IT" };
    const current = document.getElementById("lang-current");
    if (current) current.textContent = labels[lang] || "DE";
  }

  function applyTranslations(lang) {
    if (!window.TRANSLATIONS || !window.TRANSLATIONS[lang]) return;

    document.documentElement.lang = lang;
    updateLangLabel(lang);

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      translateElement(el, lang);
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      translatePlaceholder(el, lang);
    });
  }

  function closeLangMenu() {
    const menu = document.getElementById("lang-menu");
    if (menu) menu.classList.remove("open");
  }

  window.toggleLangMenu = function (event) {
    event.stopPropagation();
    const menu = document.getElementById("lang-menu");
    if (menu) menu.classList.toggle("open");
  };

  window.setLang = function (lang) {
    if (!window.TRANSLATIONS || !window.TRANSLATIONS[lang]) return;
    localStorage.setItem("siteLang", lang);
    applyTranslations(lang);
    closeLangMenu();
  };

  document.addEventListener("click", function () {
    closeLangMenu();
  });

  document.addEventListener("DOMContentLoaded", function () {
    const lang = getCurrentLang();
    applyTranslations(lang);
  });
})();
