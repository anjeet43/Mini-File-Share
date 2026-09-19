# Mini File Share

A LAN-first file sharing tool. Run it on your machine, connect from any
device on the same Wi-Fi — no internet required.

## Run it

```
npm install
node server.js
```

Then open `http://localhost:3000` (or the LAN address shown in the app's
network panel) from any device on the same network.

## Structure

```
server.js              Express server: upload, list, download, delete, network info
public/
  index.html            App shell markup
  css/
    tokens.css           Design tokens (color, type, spacing) — dark/light/system
    base.css             Reset + global element styles
    layout.css           App shell, header, body grid, panel shells
    components.css       Buttons, upload zone/queue, file list, toasts, etc.
    animations.css        Entrance/exit motion, respects prefers-reduced-motion
  js/
    utils.js              Formatting helpers + safe DOM element builder
    icons.js               Local SVG icon set (no icon font/CDN)
    api.js                  fetch/XHR wrappers around the server API
    theme.js                Dark/light/system theme switching, persisted
    network.js              Connection panel: local address, status, mobile drawer
    files.js                 File list: render, search, sort, delete
    upload.js                 Drag-and-drop, upload queue, progress, cancel/retry
    app.js                    Bootstraps the modules above
```

## API

```
GET    /files            List uploaded files
POST   /upload            Upload a file (multipart field: "file")
GET    /download/:id       Download a file
DELETE /files/:id            Delete a file
GET    /api/network           Local IPv4 address(es) + port, for the connection panel
```

`/files`, `/upload`, `/download/:id`, and `DELETE /files/:id` are unchanged
from the original contract. `/api/network` is new — it just reads the
machine's own network interfaces (`os.networkInterfaces()`), no external
calls, so it works fully offline.
