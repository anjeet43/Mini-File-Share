/* global window */

(function () {
  "use strict";

  const ENTER_ANIMATION_MS = 320;
  const LEAVE_ANIMATION_MS = 220;
  const REFRESH_MS = 3000;

  let files = [];
  let renderedIds = new Set();
  let searchTerm = "";
  let sortKey = "newest";
  let listEl, countLabelEl, searchInputEl, sortSelectEl;

  function cacheElements() {
    listEl = document.getElementById("file-list");
    countLabelEl = document.getElementById("file-count-label");
    searchInputEl = document.getElementById("search-input");
    sortSelectEl = document.getElementById("sort-select");
  }

  function visibleFiles() {
    let result = files;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter((f) =>
        f.name.toLowerCase().includes(term)
      );
    }

    const sorted = result.slice();

    switch (sortKey) {
      case "oldest":
        sorted.sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at)
        );
        break;

      case "name":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;

      case "size":
        sorted.sort((a, b) => b.size - a.size);
        break;

      case "newest":
      default:
        sorted.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        break;
    }

    return sorted;
  }

  function buildRow(file) {
    const { el } = window.MFS.utils;
    const { icon, iconNameForFile } = window.MFS.icons;
    const { formatSize, formatRelativeTime, formatAbsoluteTime } =
      window.MFS.utils;

    const iconName = iconNameForFile(file.name, file.type);
    const sizeText = formatSize(file.size);
    const timeText = formatRelativeTime(file.created_at);

    const actions = el("div", { class: "file-actions" }, [
      el(
        "a",
        {
          class: "icon-button",
          href: window.MFS.api.downloadUrl(file.id),
          "aria-label": "Download " + file.name,
          title: "Download",
        },
        [icon("download")]
      ),

      el(
        "button",
        {
          class: "icon-button",
          type: "button",
          "aria-label": "Delete " + file.name,
          title: "Delete",
          onclick: () => startDeleteConfirm(row, file, actions),
        },
        [icon("trash")]
      ),
    ]);

    const row = el(
      "div",
      {
        class: "file-row",
        role: "listitem",
        "data-id": file.id,
      },
      [
        icon(iconName, "file-icon"),

        el("div", { class: "file-name-col" }, [
          el("span", {
            class: "file-name",
            text: file.name,
            title: file.name,
          }),

          el("span", {
            class: "file-name-mobile-meta mono",
            text: sizeText + " · " + timeText,
          }),
        ]),

        el("span", {
          class: "file-size mono",
          text: sizeText,
        }),

        el("span", {
          class: "file-date mono",
          text: timeText,
          title: formatAbsoluteTime(file.created_at),
        }),

        actions,
      ]
    );

    return row;
  }

  function startDeleteConfirm(row, file, actionsEl) {
    if (row.dataset.confirming === "true") return;

    row.dataset.confirming = "true";

    const { el } = window.MFS.utils;
    const { icon } = window.MFS.icons;

    const original = Array.from(actionsEl.children);

    original.forEach((child) => (child.hidden = true));

    const confirmGroup = el("div", { class: "confirm-row" }, [
      el("span", { text: "Delete?" }),

      el(
        "button",
        {
          class: "icon-button",
          type: "button",
          "aria-label": "Cancel delete",
          title: "Cancel",
          onclick: () => {
            confirmGroup.remove();
            original.forEach((child) => (child.hidden = false));
            delete row.dataset.confirming;
          },
        },
        [icon("close")]
      ),

      el(
        "button",
        {
          class: "icon-button danger",
          type: "button",
          "aria-label": "Confirm delete",
          title: "Confirm delete",
          onclick: () =>
            confirmDelete(
              row,
              file,
              confirmGroup,
              original,
              actionsEl
            ),
        },
        [icon("check")]
      ),
    ]);

    actionsEl.appendChild(confirmGroup);
  }

  async function confirmDelete(
    row,
    file,
    confirmGroup,
    original,
    actionsEl
  ) {
    confirmGroup
      .querySelectorAll("button")
      .forEach((btn) => (btn.disabled = true));

    try {
      await window.MFS.api.deleteFile(file.id);

      row.dataset.leaving = "true";

      setTimeout(() => {
        files = files.filter((f) => f.id !== file.id);
        renderedIds.delete(file.id);
        row.remove();
        updateCountLabel();
      }, LEAVE_ANIMATION_MS);

      window.MFS.toast.show(
        "Deleted " + file.name,
        "success"
      );
    } catch (err) {
      window.MFS.toast.show(
        err.message || "Couldn't delete file",
        "error"
      );

      confirmGroup.remove();
      original.forEach((child) => (child.hidden = false));
      delete row.dataset.confirming;
    }
  }

  function buildEmptyState() {
    const { el } = window.MFS.utils;
    const { icon } = window.MFS.icons;

    const hasFilter = searchTerm.length > 0;

    return el("div", { class: "empty-state" }, [
      icon(
  hasFilter ? "search" : "inbox",
  "empty-state-icon"
),

      el("p", {
        text: hasFilter
          ? "No files match your search"
          : "No files yet",
      }),

      el("p", {
        text: hasFilter
          ? "Try a different name or clear the search"
          : "Drop a file above to share it on this network",
      }),
    ]);
  }

  function updateCountLabel() {
    if (!countLabelEl) return;

    const n = files.length;

    countLabelEl.textContent =
      n === 1 ? "1 file" : n + " files";
  }

  function render() {
    if (!listEl) return;

    const items = visibleFiles();

    listEl.innerHTML = "";

    if (items.length === 0) {
      listEl.appendChild(buildEmptyState());
      updateCountLabel();
      return;
    }

    const currentIds = new Set(
      items.map((f) => f.id)
    );

    items.forEach((file) => {
      const row = buildRow(file);

      if (!renderedIds.has(file.id)) {
        row.dataset.entering = "true";

        setTimeout(() => {
          delete row.dataset.entering;
        }, ENTER_ANIMATION_MS);
      }

      listEl.appendChild(row);
    });

    renderedIds = currentIds;

    updateCountLabel();
  }

  async function refresh() {
    try {
      files = await window.MFS.api.getFiles();
      render();
    } catch (err) {
      window.MFS.toast.show(
        err.message || "Couldn't load files",
        "error"
      );
    }
  }

  function init() {
    cacheElements();

    if (!listEl) return;

    if (searchInputEl) {
      searchInputEl.addEventListener(
        "input",
        window.MFS.utils.debounce((e) => {
          searchTerm = e.target.value.trim();
          render();
        }, 150)
      );
    }

    if (sortSelectEl) {
      sortSelectEl.addEventListener("change", (e) => {
        sortKey = e.target.value;
        render();
      });
    }

    // Initial load
    refresh();

    // Automatically detect files uploaded from other devices
    setInterval(() => {
      if (!document.hidden) {
        refresh();
      }
    }, REFRESH_MS);
  }

  window.MFS = window.MFS || {};
  window.MFS.files = { init, refresh };
})();