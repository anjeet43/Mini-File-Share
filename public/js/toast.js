/* global window */
(function () {
  "use strict";

  const AUTO_DISMISS_MS = 4200;
  const LEAVE_ANIMATION_MS = 200;

  let stackEl = null;

  function stack() {
    if (!stackEl) stackEl = document.getElementById("toast-stack");
    return stackEl;
  }

  function show(message, kind) {
    const el = window.MFS.utils.el;
    const container = stack();
    if (!container) return;

    const toast = el(
      "div",
      { class: "toast", "data-kind": kind || "success", role: "status" },
      [
        window.MFS.icons.icon(kind === "error" ? "alert" : "check"),
        el("span", { text: message }),
      ]
    );

    container.appendChild(toast);

    const timer = setTimeout(() => dismiss(toast), AUTO_DISMISS_MS);

    toast.addEventListener("click", () => {
      clearTimeout(timer);
      dismiss(toast);
    });
  }

  function dismiss(toast) {
    if (!toast || toast.dataset.leaving === "true") return;
    toast.dataset.leaving = "true";
    toast.addEventListener(
      "animationend",
      () => toast.remove(),
      { once: true }
    );
    // Fallback in case prefers-reduced-motion strips the animation.
    setTimeout(() => toast.remove(), LEAVE_ANIMATION_MS + 50);
  }

  window.MFS = window.MFS || {};
  window.MFS.toast = { show };
})();
