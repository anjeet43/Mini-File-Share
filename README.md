# 📁 Mini File Share

> **Fast, private, and simple file sharing over your local network.**

Mini File Share lets you transfer files between your **computer, phone, tablet, or another laptop** when they are connected to the same Wi-Fi network.

No account.  
No cloud storage.  
No internet required.

---

## ✨ Features

- 🚀 Fast local-network file transfers
- 📱 Works with phones, tablets, laptops, and desktops
- 🔒 Files stay on your local network
- 🌐 No internet connection required
- 📤 Drag & drop file uploads
- 📊 Upload progress tracking
- 🔄 Cancel and retry uploads
- 📥 Download shared files
- 🗑️ Delete files
- 🔎 Search files
- ↕️ Sort files by name, size, or date
- 🔄 Automatically refreshes the file list
- 📡 Detects your local network address
- 📷 QR code for quick device connection
- 🌙 Dark and light themes
- 📱 Responsive interface for mobile and desktop

---

# 🚀 Getting Started

## 1. Requirements

Before starting, make sure you have:

- [Node.js](https://nodejs.org/) installed
- A computer connected to Wi-Fi or Ethernet
- The device you want to connect also connected to the **same network**

> **Important:** Both devices must be connected to the same local network.

---

## 2. Download the Project

Clone the repository:

```bash
git clone https://github.com/anjeet43/Mini-File-Share.git
```

Enter the project folder:

```bash
cd Mini-File-Share
```

---

## 3. Install Dependencies

Run:

```bash
npm install
```

This installs all required Node.js dependencies.

---

## 4. Start the Server

Run:

```bash
npm start
```

You should see something similar to:

```text
Server running on http://0.0.0.0:3000
```

Mini File Share is now running on your computer.

---

# 📱 Connect Your Phone or Another Device

This is the easiest way to use Mini File Share.

## Step 1 — Connect Both Devices to the Same Wi-Fi

For example:

```text
💻 Computer  ───┐
                │
                ├── 📶 Same Wi-Fi
                │
📱 Phone     ───┘
```

Your computer and phone must be on the same network.

---

## Step 2 — Open Mini File Share on Your Computer

On the computer running the server, open:

```text
http://localhost:3000
```

You will see the Mini File Share interface.

---

## Step 3 — Find Your Network Address

Open the **Network / Connection panel** in Mini File Share.

It will show an address similar to:

```text
192.168.1.5:3000
```

You may also see a **QR code** for connecting quickly.

---

## Step 4 — Connect Your Phone

On your phone:

1. Make sure it is connected to the same Wi-Fi.
2. Open Chrome, Safari, or another browser.
3. Enter the address shown by Mini File Share.

For example:

```text
http://192.168.1.5:3000
```

Or simply scan the QR code displayed by the application.

---

## Step 5 — Start Sharing

Once the website opens on your phone:

### Upload a file

Tap the upload area and select a file.

Or, on a computer, simply drag a file into the upload area.

### Download a file

Select the download button next to a shared file.

### Delete a file

Select the delete button next to the file.

That's it. 🎉

---

# ⚠️ `localhost` vs LAN Address

This is important when connecting another device.

### On the computer running Mini File Share

Use:

```text
http://localhost:3000
```

### On your phone or another computer

Do **not** use:

```text
http://localhost:3000
```

Instead, use the computer's local network address:

```text
http://192.168.1.5:3000
```

### Why?

`localhost` always refers to the device you are currently using.

So:

```text
Computer:
localhost → Computer

Phone:
localhost → Phone
```

The phone therefore needs the computer's LAN address.

---

# 📷 QR Code Connection

Mini File Share provides a QR code containing the local network address.

Instead of manually typing:

```text
http://192.168.1.5:3000
```

simply scan the QR code with your phone.

The browser will automatically open Mini File Share.

---

# 🖥️ Example

Imagine your computer has this address:

```text
192.168.1.5
```

Mini File Share runs on port:

```text
3000
```

Your phone can therefore connect using:

```text
http://192.168.1.5:3000
```

The complete setup looks like:

```text
              📶 Wi-Fi Network
                    │
          ┌─────────┴─────────┐
          │                   │
       💻 Mac                📱 Phone
          │                   │
          │  Mini File Share  │
          └─────────┬─────────┘
                    │
             File Transfer
                    │
             📤 Upload
             📥 Download
```

---

# 🔒 Privacy

Mini File Share is designed for local network sharing.

Files are stored on the computer running the application:

```text
storage/files/
```

File information is stored locally in:

```text
data/files.db
```

Mini File Share does not require a cloud storage service for its current LAN-based operation.

### Important

There is currently no user authentication system.

Therefore:

- Use Mini File Share on trusted networks.
- Avoid exposing port `3000` directly to the public internet.
- Do not share sensitive files on an untrusted network.
- Stop the server when you no longer need file sharing.

---

# 🛠️ Troubleshooting

## Phone cannot connect

Check the following:

### 1. Same Wi-Fi

Make sure both devices are connected to the same network.

```text
💻 Computer → 📶 Wi-Fi ← 📱 Phone
```

### 2. Server is running

The terminal should show:

```text
Server running on http://0.0.0.0:3000
```

### 3. Use the LAN address

On another device, use:

```text
http://192.168.x.x:3000
```

Not:

```text
http://localhost:3000
```

### 4. Check your firewall

Your computer's firewall may block incoming connections to Node.js or port `3000`.

---

## LAN Address Changed

Your router may assign a different local IP address when you reconnect to Wi-Fi.

Check the **Network / Connection panel** in Mini File Share and use the currently displayed address.

---

## Port 3000 Is Already in Use

If another application is already using port `3000`, stop that application or change the port in:

```text
server.js
```

---

# 🧑‍💻 Development

Start the application:

```bash
npm start
```

Open:

```text
http://localhost:3000
```

Frontend files are located inside:

```text
public/
```

Backend logic is located in:

```text
server.js
```

---

# 📂 Project Structure

```text
MiniFileShare/
│
├── server.js
├── package.json
├── package-lock.json
├── README.md
├── .gitignore
│
├── data/
│   └── files.db
│
├── storage/
│   └── files/
│
└── public/
    │
    ├── index.html
    │
    ├── css/
    │   ├── tokens.css
    │   ├── base.css
    │   ├── layout.css
    │   ├── components.css
    │   └── animations.css
    │
    └── js/
        ├── utils.js
        ├── icons.js
        ├── api.js
        ├── theme.js
        ├── network.js
        ├── files.js
        ├── upload.js
        └── app.js
```

---

# 🧩 Main Components

| File | Description |
|------|-------------|
| `server.js` | Express server and file APIs |
| `index.html` | Main application interface |
| `tokens.css` | Colors, typography, spacing, and design tokens |
| `base.css` | Global styles and reset |
| `layout.css` | Application layout and responsive structure |
| `components.css` | UI components, upload area, file list, transfers, and toasts |
| `animations.css` | UI animations |
| `utils.js` | Formatting and DOM utilities |
| `icons.js` | Local SVG icons |
| `api.js` | Client-side API and upload requests |
| `theme.js` | Dark/light/system theme handling |
| `network.js` | Network status, address, and QR connection |
| `files.js` | File listing, search, sorting, and deletion |
| `upload.js` | Upload queue, progress, cancel, and retry |
| `app.js` | Application initialization |

---

# 🔌 API

Mini File Share currently provides the following API endpoints.

## List Files

```http
GET /files
```

Returns the files currently stored on the server.

---

## Upload File

```http
POST /upload
```

Uploads a file using multipart form data.

Field name:

```text
file
```

---

## Download File

```http
GET /download/:id
```

Downloads a stored file using its file ID.

---

## Delete File

```http
DELETE /files/:id
```

Deletes a stored file.

---

## Network Information

```http
GET /api/network
```

Returns the local IPv4 addresses and server port.

Example:

```json
{
  "addresses": [
    {
      "address": "192.168.1.5",
      "family": "IPv4"
    }
  ],
  "port": 3000
}
```

The endpoint reads the computer's local network interfaces using:

```javascript
os.networkInterfaces()
```

No external service is required to discover the local address.

---

# 🏗️ Architecture

The current version uses a simple local server architecture:

```text
┌─────────────────────┐
│      Browser        │
│  Phone / Laptop     │
└──────────┬──────────┘
           │
           │ HTTP
           ▼
┌─────────────────────┐
│    Express Server   │
│                     │
│  Upload             │
│  Download           │
│  Delete             │
│  File List          │
│  Network Info       │
└──────────┬──────────┘
           │
     ┌─────┴─────┐
     ▼           ▼
┌─────────┐  ┌──────────────┐
│ SQLite  │  │ Local Storage│
│         │  │              │
│ Metadata│  │ Uploaded     │
│         │  │ Files        │
└─────────┘  └──────────────┘
```

All file transfers in the current version pass through the computer running Mini File Share.

---

# 🔮 Future Direction

The project is being developed toward a more direct device-to-device sharing experience.

Planned improvements include:

- 🔗 Peer-to-peer file transfers
- 🌐 WebRTC-based connections
- 📡 Device discovery
- 📤 Direct browser-to-browser transfers
- 📦 Large-file chunking
- 🔄 Resumable transfers
- ✅ Transfer integrity verification
- ⚡ Improved transfer performance
- 📱 Improved mobile experience
- 🔐 Stronger connection and access controls

The long-term goal is to make local file sharing feel as simple as:

```text
Select Device → Select File → Send
```

while keeping transfers as direct and local as possible.

---

# 📜 License

This project is currently provided for personal and educational use.

---

## ⭐ Mini File Share

**Private. Local. Fast.**

Built for simple file sharing between devices on the same network.
