/* global window */
(function () {
  "use strict";

async function getFiles() {
  const res = await fetch("/files", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Could not load files");
  }

  return res.json();
}
  async function deleteFile(id) {
    const res = await fetch("/files/" + encodeURIComponent(id), {
      method: "DELETE",
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.msg || "Could not delete file");
    }
    return res.json();
  }

  function downloadUrl(id) {
    return "/download/" + encodeURIComponent(id);
  }

  async function getNetworkInfo() {
    const res = await fetch("/api/network");
    if (!res.ok) throw new Error("Could not reach server");
    return res.json();
  }

  // XHR (not fetch) because it's the only API with upload progress events
  // and a synchronous abort() handle for the queue's cancel button.
  // Returns { promise, xhr } — the caller can abort via the xhr handle
  // before the promise settles.
  function uploadFile(file, onProgress) {
    const xhr = new XMLHttpRequest();

    const promise = new Promise((resolve, reject) => {
      xhr.open("POST", "/upload");

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable && onProgress) {
          onProgress(e.loaded, e.total);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            resolve(JSON.parse(xhr.responseText));
          } catch (e) {
            reject(new Error("Unexpected server response"));
          }
        } else {
          let message = "Upload failed";
          try {
            message = JSON.parse(xhr.responseText).msg || message;
          } catch (e) {
            /* non-JSON error body, keep default message */
          }
          reject(new Error(message));
        }
      };

      xhr.onerror = () => reject(new Error("Network error"));

      xhr.onabort = () => {
        const err = new Error("Upload canceled");
        err.aborted = true;
        reject(err);
      };

      const formData = new FormData();
      formData.append("file", file);
      xhr.send(formData);
    });

    return { promise, xhr };
  }

  window.MFS = window.MFS || {};
  window.MFS.api = {
    getFiles,
    deleteFile,
    downloadUrl,
    getNetworkInfo,
    uploadFile,
  };
})();
