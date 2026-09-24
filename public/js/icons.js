/* global window */
(function () {
  "use strict";

  // Every path below is authored for this project — no icon font, no CDN.
  const PATHS = {
    brand:
      '<path d="M3 12h4l2-3 3 6 2-4h7" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
    image:
      '<rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" stroke-width="1.4" fill="none"/><circle cx="8.5" cy="9.5" r="1.5" stroke="currentColor" stroke-width="1.4" fill="none"/><path d="M21 16l-5.5-5.5-4 4L8 12l-5 5" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
    video:
      '<rect x="3" y="5" width="14" height="14" rx="2" stroke="currentColor" stroke-width="1.4" fill="none"/><path d="M17 9.5l4-2.3v9.6l-4-2.3" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linejoin="round"/>',
    audio:
      '<path d="M4 10v4h3l5 4V6L7 10H4z" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linejoin="round"/><path d="M17 8.5a5 5 0 010 7" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linecap="round"/>',
    document:
      '<path d="M7 3h7l4 4v14H7V3z" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linejoin="round"/><path d="M14 3v4h4" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linejoin="round"/><path d="M9.5 13h5M9.5 16h5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>',
    archive:
      '<rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" stroke-width="1.4" fill="none"/><path d="M9 4v3M9 9v1.4M9 12.4v1.2M9 15.6V17" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><circle cx="9" cy="15" r="1.2" stroke="currentColor" stroke-width="1.2" fill="none"/>',
    code:
      '<path d="M9 8l-4 4 4 4M15 8l4 4-4 4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
    file:
      '<path d="M7 3h7l4 4v14H7V3z" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linejoin="round"/><path d="M14 3v4h4" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linejoin="round"/>',
    upload:
      '<path d="M12 16V6M8 10l4-4 4 4" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 17v1.5A2.5 2.5 0 007.5 21h9a2.5 2.5 0 002.5-2.5V17" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/>',
    download:
      '<path d="M12 4v10M8 10l4 4 4-4" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 17v1.5A2.5 2.5 0 007.5 21h9a2.5 2.5 0 002.5-2.5V17" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/>',
    trash:
      '<path d="M5 7h14M10 7V5a1 1 0 011-1h2a1 1 0 011 1v2m-7 0l1 12.5A1.5 1.5 0 007.5 21h9a1.5 1.5 0 001.5-1.5L19 7" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
    close:
      '<path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
    copy:
      '<rect x="9" y="9" width="11" height="11" rx="1.6" stroke="currentColor" stroke-width="1.4" fill="none"/><path d="M6 15H5.5A1.5 1.5 0 014 13.5v-9A1.5 1.5 0 015.5 3h9A1.5 1.5 0 0116 4.5V6" stroke="currentColor" stroke-width="1.4" fill="none"/>',
    check:
      '<path d="M5 13l4 4 10-10" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
    alert:
      '<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M12 8v5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="12" cy="16" r="1" fill="currentColor"/>',
    inbox:
      '<path d="M4 13l2.5-7A2 2 0 018.4 4.5h7.2a2 2 0 011.9 1.5L20 13" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 13v4.5A1.5 1.5 0 005.5 19h13a1.5 1.5 0 001.5-1.5V13h-4.2a2 2 0 00-1.9 1.4v.1a1.6 1.6 0 01-1.5 1H12a1.6 1.6 0 01-1.5-1v-.1A2 2 0 008.6 13H4z" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linejoin="round"/>',
    retry:
      '<path d="M4 12a8 8 0 0114-5.3M20 12a8 8 0 01-14 5.3" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/><path d="M18 3v4.5h-4.5M6 21v-4.5h4.5" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
    search:
      '<circle cx="10.5" cy="10.5" r="6" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M20 20l-4.8-4.8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  };

  const EXTENSION_MAP = {
    png: "image",
    jpg: "image",
    jpeg: "image",
    gif: "image",
    webp: "image",
    svg: "image",
    bmp: "image",
    heic: "image",
    mp4: "video",
    mov: "video",
    mkv: "video",
    avi: "video",
    webm: "video",
    mp3: "audio",
    wav: "audio",
    flac: "audio",
    m4a: "audio",
    ogg: "audio",
    pdf: "document",
    doc: "document",
    docx: "document",
    txt: "document",
    md: "document",
    zip: "archive",
    rar: "archive",
    "7z": "archive",
    tar: "archive",
    gz: "archive",
    js: "code",
    ts: "code",
    py: "code",
    json: "code",
    html: "code",
    css: "code",
    c: "code",
    cpp: "code",
    java: "code",
  };

  function iconNameForFile(filename, mimeType) {
    const ext = window.MFS.utils.extensionOf(filename || "");
    if (EXTENSION_MAP[ext]) return EXTENSION_MAP[ext];

    if (mimeType) {
      if (mimeType.startsWith("image/")) return "image";
      if (mimeType.startsWith("video/")) return "video";
      if (mimeType.startsWith("audio/")) return "audio";
      if (mimeType === "application/pdf") return "document";
    }

    return "file";
  }

  function icon(name, className) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    if (className) svg.setAttribute("class", className);
    svg.innerHTML = PATHS[name] || PATHS.file;
    return svg;
  }


  function hydrateIcons(root) {
    (root || document).querySelectorAll("[data-icon]").forEach((placeholder) => {
      const name = placeholder.getAttribute("data-icon");
      const svg = icon(name, placeholder.getAttribute("class") || undefined);
      placeholder.replaceWith(svg);
    });
  }

  window.MFS = window.MFS || {};
  window.MFS.icons = { icon, iconNameForFile, hydrateIcons };
})();
