/* global window */
(function () {
  "use strict";

  const REMOVE_DELAY_MS = 900;

  let zoneEl, inputEl, queueEl, queueListEl, queueSummaryEl;
  let dragDepth = 0;
  const jobs = new Map(); // jobId -> { xhr, file }

  function cacheElements() {
    zoneEl = document.getElementById("upload-zone");
    inputEl = document.getElementById("file-input");
    queueEl = document.getElementById("upload-queue");
    queueListEl = document.getElementById("upload-queue-list");
    queueSummaryEl = document.getElementById("upload-queue-summary");
  }

  function updateQueueVisibility() {
    const hasJobs = jobs.size > 0;
    queueEl.hidden = !hasJobs;
    if (hasJobs) {
      queueSummaryEl.textContent =
        jobs.size === 1 ? "1 file" : jobs.size + " files";
    }
  }

  function buildQueueItem(jobId, file) {
    const { el, formatSize } = window.MFS.utils;
    const { icon } = window.MFS.icons;

    const meta = el("span", {
      class: "queue-item-meta mono",
      text: "0% · " + formatSize(file.size),
    });

    const fill = el("div", { class: "queue-item-fill" });
    const track = el("div", { class: "queue-item-track" }, [fill]);

    const cancelBtn = el(
      "button",
      {
        class: "icon-button",
        type: "button",
        "aria-label": "Cancel upload of " + file.name,
        title: "Cancel",
        onclick: () => cancelJob(jobId),
      },
      [icon("close")]
    );

    const actions = el("div", { class: "queue-item-actions" }, [cancelBtn]);

    const item = el(
      "div",
      { class: "queue-item", "data-state": "uploading", "data-job": jobId },
      [
        el("span", { class: "queue-item-name", text: file.name, title: file.name }),
        meta,
        track,
        actions,
      ]
    );

    return { item, meta, fill, actions, cancelBtn };
  }

  function setJobError(refs, jobId, file, message) {
    refs.item.dataset.state = "error";
    refs.meta.textContent = message;

    const { el } = window.MFS.utils;
    const { icon } = window.MFS.icons;

    refs.actions.innerHTML = "";
    refs.actions.appendChild(
      el(
        "button",
        {
          class: "icon-button",
          type: "button",
          "aria-label": "Retry upload of " + file.name,
          title: "Retry",
          onclick: () => {
            jobs.delete(jobId);
            refs.item.remove();
            updateQueueVisibility();
            startUpload(file);
          },
        },
        [icon("retry")]
      )
    );
    refs.actions.appendChild(
      el(
        "button",
        {
          class: "icon-button",
          type: "button",
          "aria-label": "Dismiss",
          title: "Dismiss",
          onclick: () => {
            jobs.delete(jobId);
            refs.item.remove();
            updateQueueVisibility();
          },
        },
        [icon("close")]
      )
    );

    window.MFS.toast.show("Couldn't upload " + file.name, "error");
  }

  function cancelJob(jobId) {
    const job = jobs.get(jobId);
    if (job) job.xhr.abort();
  }

  function startUpload(file) {
    const jobId = "job-" + Math.random().toString(36).slice(2);
    const refs = buildQueueItem(jobId, file);
    queueListEl.appendChild(refs.item);
    jobs.set(jobId, { file });
    updateQueueVisibility();

    const { formatSize } = window.MFS.utils;

    const onProgress = (loaded, total) => {
      const pct = Math.round((loaded / total) * 100);
      refs.fill.style.width = pct + "%";
      refs.meta.textContent =
        pct + "% · " + formatSize(loaded) + " / " + formatSize(total);
    };

    const { xhr, promise } = window.MFS.api.uploadFile(file, onProgress);
    jobs.set(jobId, { xhr, file });

    promise
  .then(async () => {
    refs.item.dataset.state = "done";
    refs.fill.style.width = "100%";
    refs.meta.textContent = "100% · " + formatSize(file.size);
    refs.actions.innerHTML = "";

    window.MFS.toast.show("Uploaded " + file.name, "success");

    try {
      await window.MFS.files.refresh();
    } catch (e) {
      console.error("File list refresh failed:", e);
    }

    setTimeout(() => {
      jobs.delete(jobId);
      refs.item.remove();
      updateQueueVisibility();
    }, REMOVE_DELAY_MS);
  })
      .catch((err) => {
        if (err.aborted) {
          jobs.delete(jobId);
          refs.item.remove();
          updateQueueVisibility();
          return;
        }
        setJobError(refs, jobId, file, err.message || "Upload failed");
      });
  }

  function handleFiles(fileList) {
    Array.from(fileList || []).forEach((file) => startUpload(file));
  }

  function setDragOver(isOver) {
    zoneEl.setAttribute("data-dragover", isOver ? "true" : "false");
  }

  function init() {
    cacheElements();
    if (!zoneEl || !inputEl) return;

    window.MFS.icons.hydrateIcons(zoneEl);

    inputEl.addEventListener("change", () => {
      handleFiles(inputEl.files);
      inputEl.value = "";
    });


    zoneEl.addEventListener("dragenter", (e) => {
      e.preventDefault();
      dragDepth += 1;
      setDragOver(true);
    });

    zoneEl.addEventListener("dragover", (e) => {
      e.preventDefault();
    });

    zoneEl.addEventListener("dragleave", () => {
      dragDepth = Math.max(0, dragDepth - 1);
      if (dragDepth === 0) setDragOver(false);
    });

    zoneEl.addEventListener("drop", (e) => {
      e.preventDefault();
      dragDepth = 0;
      setDragOver(false);
      handleFiles(e.dataTransfer.files);
    });
  }

  window.MFS = window.MFS || {};
  window.MFS.upload = { init };
})();
