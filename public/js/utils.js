/* global window */
(function () {
  "use strict";

  function formatSize(bytes) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    if (bytes < 1024 * 1024 * 1024) {
      return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    }
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
  }

  function formatRelativeTime(isoString) {
    const then = new Date(isoString).getTime();
    const now = Date.now();
    const diffSeconds = Math.round((now - then) / 1000);

    if (diffSeconds < 5) return "just now";
    if (diffSeconds < 60) return diffSeconds + "s ago";

    const diffMinutes = Math.round(diffSeconds / 60);
    if (diffMinutes < 60) return diffMinutes + "m ago";

    const diffHours = Math.round(diffMinutes / 60);
    if (diffHours < 24) return diffHours + "h ago";

    const diffDays = Math.round(diffHours / 24);
    if (diffDays < 7) return diffDays + "d ago";

    const date = new Date(isoString);
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  }

  function formatAbsoluteTime(isoString) {
    const date = new Date(isoString);
    return date.toLocaleString();
  }

  function el(tag, attrs, children) {
    const node = document.createElement(tag);

    if (attrs) {
      Object.keys(attrs).forEach((key) => {
        if (key === "class") {
          node.className = attrs[key];
        } else if (key === "text") {
          node.textContent = attrs[key];
        } else if (key.startsWith("data-")) {
          node.setAttribute(key, attrs[key]);
        } else if (key.startsWith("aria-")) {
          node.setAttribute(key, attrs[key]);
        } else {
          node[key] = attrs[key];
        }
      });
    }

    (children || []).forEach((child) => {
      if (child) node.appendChild(child);
    });

    return node;
  }

  function debounce(fn, wait) {
    let timer = null;
    return function debounced(...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  function extensionOf(filename) {
    const idx = filename.lastIndexOf(".");
    if (idx === -1 || idx === filename.length - 1) return "";
    return filename.slice(idx + 1).toLowerCase();
  }

  window.MFS = window.MFS || {};
  window.MFS.utils = {
    formatSize,
    formatRelativeTime,
    formatAbsoluteTime,
    el,
    debounce,
    extensionOf,
  };
})();
