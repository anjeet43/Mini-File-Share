/* global window */
(function () {
  "use strict";

  const POLL_MS = 30000;
  const MOBILE_QUERY = "(max-width: 899px)";

  let elements = {};
  let currentNetworkUrl = "";

  function cacheElements() {
    elements = {
      pill: document.getElementById("network-pill"),
      pillLabel: document.getElementById("network-pill-label"),
      dots: document.querySelectorAll('[data-role="network-status-dot"]'),
      panel: document.getElementById("network-panel"),
      backdrop: document.getElementById("network-panel-backdrop"),
      closeBtn: document.getElementById("network-panel-close"),
      addressText: document.getElementById("network-address-text"),
      statusText: document.getElementById("network-status-text"),
      copyBtn: document.getElementById("network-copy-btn"),
      qrBtn: document.getElementById("network-qr-btn"),
    };
  }

  function setStatus(isOnline) {
    elements.dots.forEach((dot) => {
      dot.setAttribute("data-status", isOnline ? "online" : "offline");
    });
    if (elements.pillLabel) {
      elements.pillLabel.textContent = isOnline
        ? "Local network"
        : "Reconnecting…";
    }
    if (elements.statusText) {
      elements.statusText.textContent = isOnline
        ? "Connected — anyone on this Wi-Fi can reach this server"
        : "Lost contact with the server — retrying…";
    }
  }

  async function refresh() {
    try {
      const info = await window.MFS.api.getNetworkInfo();

      const address = info.addresses && info.addresses[0];

      const host = address
        ? address.address
        : window.location.hostname;

      const full = host + ":" + info.port;

      if (elements.addressText) {
        elements.addressText.textContent = full;
        elements.addressText.dataset.address = full;
      }

      // Full URL used by the QR code
      currentNetworkUrl = "http://" + full;
      updateQrCode();

      setStatus(true);

    } catch (e) {
      setStatus(false);
    }
  }

  function isMobile() {
    return window.matchMedia(MOBILE_QUERY).matches;
  }

  // On mobile the closed panel sits off-screen via transform, which alone
  // doesn't remove it from the tab order — `inert` does. On desktop the
  // panel is a normal, always-visible sidebar and must never be inert.
  function syncInertState(open) {
    const shouldBeInert = isMobile() && !open;
    elements.panel.toggleAttribute("inert", shouldBeInert);
    elements.panel.setAttribute("aria-hidden", String(shouldBeInert));
  }

  function openDrawer() {
    if (!isMobile()) return;
    elements.panel.setAttribute("data-open", "true");
    elements.backdrop.setAttribute("data-open", "true");
    syncInertState(true);
    elements.closeBtn.focus();
    document.addEventListener("keydown", onKeydown);
  }

  function closeDrawer() {
    elements.panel.setAttribute("data-open", "false");
    elements.backdrop.setAttribute("data-open", "false");
    syncInertState(false);
    document.removeEventListener("keydown", onKeydown);
    if (elements.pill) elements.pill.focus();
  }

  function onKeydown(e) {
    if (e.key === "Escape") closeDrawer();
  }

  async function copyAddress() {
    const address = elements.addressText && elements.addressText.dataset.address;
    if (!address) return;
    const url = "http://" + address;

    try {
      await navigator.clipboard.writeText(url);
    } catch (e) {
      // Clipboard API unavailable/blocked — fall back to a legacy copy.
      const helper = document.createElement("textarea");
      helper.value = url;
      helper.style.position = "fixed";
      helper.style.opacity = "0";
      document.body.appendChild(helper);
      helper.select();
      try {
        document.execCommand("copy");
      } catch (e2) {
        window.MFS.toast.show("Couldn't copy — copy it manually", "error");
        helper.remove();
        return;
      }
      helper.remove();
    }

    window.MFS.toast.show("Address copied", "success");
  }

function updateQrCode() {
  const qr = document.getElementById("qr-code");
  const url = document.getElementById("qr-url-text");

  if (!qr || !url || !currentNetworkUrl) return;

  qr.innerHTML = "";
  url.textContent = currentNetworkUrl;

  new QRCode(qr, {
    text: currentNetworkUrl,
    width: 190,
    height: 190,
    colorDark: "#111111",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.M
  });
}

  function openQrModal() {
    const modal = document.getElementById("qr-modal");

    if (!modal || !currentNetworkUrl) return;

    updateQrCode();

    modal.hidden = false;
    document.body.classList.add("qr-modal-open");

    requestAnimationFrame(() => {
      modal.classList.add("is-open");
    });
  }

  function closeQrModal() {
    const modal = document.getElementById("qr-modal");

    if (!modal) return;

    modal.classList.remove("is-open");

    setTimeout(() => {
      modal.hidden = true;
      document.body.classList.remove("qr-modal-open");
    }, 220);
  }

  function setupQrModal() {
    if (elements.qrBtn) {
      elements.qrBtn.addEventListener("click", openQrModal);
    }

    document.querySelectorAll("[data-qr-close]").forEach((el) => {
      el.addEventListener("click", closeQrModal);
    });

    const copyBtn = document.getElementById("qr-copy-btn");

    if (copyBtn) {
      copyBtn.addEventListener("click", async () => {
        if (!currentNetworkUrl) return;

        try {
          await navigator.clipboard.writeText(currentNetworkUrl);

          window.MFS.toast.show("Link copied", "success");
        } catch (e) {
          window.MFS.toast.show("Couldn't copy link", "error");
        }
      });
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeQrModal();
      }
    });
  }

  function init() {
    cacheElements();
    if (!elements.pill || !elements.panel) return;

    window.MFS.icons.hydrateIcons(elements.panel);

    syncInertState(false);
    window.matchMedia(MOBILE_QUERY).addEventListener("change", () => {
      const isOpen = elements.panel.getAttribute("data-open") === "true";
      syncInertState(isOpen);
    });

    elements.pill.addEventListener("click", openDrawer);
    elements.closeBtn.addEventListener("click", closeDrawer);
    elements.backdrop.addEventListener("click", closeDrawer);
    elements.copyBtn.addEventListener("click", copyAddress);

    setupQrModal();

    refresh();
    setInterval(refresh, POLL_MS);
  }

  window.MFS = window.MFS || {};
  window.MFS.network = { init };
})();
