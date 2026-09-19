/* global window */
(function () {
  "use strict";

  const STORAGE_KEY = "mfs-theme";
  const VALID = ["dark", "light", "system"];

  function getStored() {
    try {
      const value = window.localStorage.getItem(STORAGE_KEY);
      return VALID.includes(value) ? value : "system";
    } catch (e) {
      return "system";
    }
  }

  function apply(theme) {
    document.documentElement.setAttribute("data-theme", theme);

    document.querySelectorAll("[data-theme-option]").forEach((btn) => {
      btn.setAttribute(
        "aria-pressed",
        String(btn.getAttribute("data-theme-option") === theme)
      );
    });
  }

  function set(theme) {
    if (!VALID.includes(theme)) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      /* localStorage unavailable (private browsing) — theme still applies
         for this session, it just won't persist */
    }
    apply(theme);
  }

  function init() {
    // The <head> inline script already set data-theme before first paint;
    // this just syncs the switch UI to match and wires the buttons.
    apply(getStored());

    document.querySelectorAll("[data-theme-option]").forEach((btn) => {
      btn.addEventListener("click", () => {
        set(btn.getAttribute("data-theme-option"));
      });
    });
  }

  window.MFS = window.MFS || {};
  window.MFS.theme = { init, set };
})();
