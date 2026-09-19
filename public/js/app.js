/* global window */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    window.MFS.icons.hydrateIcons(document.querySelector(".brand"));

    window.MFS.theme.init();
    window.MFS.network.init();
    window.MFS.files.init();
    window.MFS.upload.init();
  });
})();
