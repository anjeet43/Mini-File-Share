# Mini File Share

A simple LAN-first file sharing tool that lets you transfer files between devices connected to the same Wi-Fi network.

No cloud storage.
No account.
No internet required.

## How to Use

### 1. Start Mini File Share

On the computer where the project is installed:

npm install
npm start

The server will start on:

http://localhost:3000

### 2. Connect Your Phone or Another Device

Make sure your computer and the other device are connected to the same Wi-Fi network.

Open Mini File Share on your computer and check the Network / Connection panel.

It will show a LAN address similar to:

192.168.1.5:3000

You can also scan the QR code shown in the connection panel.

### 3. Open It on Your Device

On your phone, tablet, or another laptop:

1. Connect to the same Wi-Fi.
2. Open any browser.
3. Enter the LAN address shown by Mini File Share.

For example:

http://192.168.1.5:3000

The Mini File Share interface will open on your device.

You can now upload and download files between the devices.

Important:
localhost:3000 works only on the computer running the server.
Other devices must use the computer's LAN address, such as 192.168.1.5:3000.

## Features

- Local network file sharing
- Works without internet
- No account or login required
- Upload files using drag and drop
- Upload progress tracking
- Cancel and retry uploads
- Download shared files
- Delete files
- Search files
- Sort files by name, size, or date
- Automatic file list refresh
- Local network address detection
- QR code for quick device connection
- Responsive interface for phones, tablets, and desktops
- Dark and light themes
- Compact transfer and file management interface

## Requirements

- Node.js
- A computer connected to a local network
- Another device connected to the same network for file sharing

## Installation

Clone the repository:

git clone https://github.com/anjeet43/Mini-File-Share.git

Enter the project directory:

cd Mini-File-Share

Install dependencies:

npm install

Start the server:

npm start

Open:

http://localhost:3000

## Network Usage

Mini File Share listens on all network interfaces:

0.0.0.0:3000

This allows devices on the same local network to connect to the server.

The application detects available local IPv4 addresses using:

os.networkInterfaces()

No external service is required to discover the local address.

### Example

If the computer running Mini File Share has the address:

192.168.1.5

other devices on the same network can open:

http://192.168.1.5:3000

## File Sharing Workflow

             Same Wi-Fi Network
                    |
        +-----------+-----------+
        |                       |
     Computer                 Phone
        |                       |
        |   Mini File Share     |
        +-----------+-----------+
                    |
             Upload / Download
                    |
              Local Network

The computer running Mini File Share acts as the local file server.

Files are stored locally on that computer.

## Project Structure

MiniFileShare/
|
├── server.js
├── package.json
├── package-lock.json
├── README.md
├── .gitignore
|
├── data/
│   └── files.db
|
├── storage/
│   └── files/
|
└── public/
    ├── index.html
    |
    ├── css/
    │   ├── tokens.css
    │   ├── base.css
    │   ├── layout.css
    │   ├── components.css
    │   └── animations.css
    |
    └── js/
        ├── utils.js
        ├── icons.js
        ├── api.js
        ├── theme.js
        ├── network.js
        ├── files.js
        ├── upload.js
        └── app.js

### Main Files

server.js
Express server and file APIs

index.html
Main application interface

tokens.css
Colors, typography, spacing and design tokens

base.css
Global styles and reset

layout.css
Application layout and responsive structure

components.css
Buttons, file list, upload area, transfers and toasts

animations.css
UI animations

utils.js
Formatting and DOM utilities

icons.js
Local SVG icon system

api.js
Client-side API and upload requests

theme.js
Dark/light/system theme handling

network.js
Network status, address and QR connection

files.js
File listing, search, sorting and deletion

upload.js
Upload queue, progress, cancel and retry

app.js
Application initialization

## API

### List Files

GET /files

Returns the files currently stored on the server.

### Upload File

POST /upload

Uploads a file using multipart form data.

Field name:

file

### Download File

GET /download/:id

Downloads a stored file using its file ID.

### Delete File

DELETE /files/:id

Deletes a stored file.

### Network Information

GET /api/network

Returns the local network addresses and server port used by the application.

Example response:

{
  "addresses": [
    {
      "address": "192.168.1.5",
      "family": "IPv4"
    }
  ],
  "port": 3000
}

The endpoint only reads the machine's local network interfaces.

It does not contact an external server.

## Storage

Uploaded files are stored locally in:

storage/files/

File metadata is stored in:

data/files.db

Mini File Share does not require a cloud storage service.

## Security & Privacy

Mini File Share is designed primarily for use on a trusted local network.

Files are served by the computer running the application and are accessible to devices that can reach the server on the network.

There is currently no user authentication system.

For this reason:

- Use it on trusted networks.
- Avoid exposing port 3000 directly to the public internet.
- Do not share sensitive files on an untrusted network.
- Stop the server when you no longer need file sharing.

## Troubleshooting

### My Phone Cannot Connect

Check that:

1. Both devices are connected to the same Wi-Fi.
2. Mini File Share is running.
3. You are using the computer's LAN address, not localhost.
4. The computer's firewall is allowing connections to Node.js / port 3000.

Example:

Correct:
http://192.168.1.5:3000

Incorrect on another device:
http://localhost:3000

### The LAN Address Changed

Your router may assign a different local IP address after reconnecting to Wi-Fi.

Open the Network panel in Mini File Share and use the currently displayed address.

### Port 3000 Is Already in Use

Stop the application using port 3000, or change the server port in server.js.

## Development

Start the server:

npm start

The application runs locally at:

http://localhost:3000

During development, edit files inside:

public/

for the frontend and:

server.js

for the backend.

## Architecture

The current architecture is intentionally simple:

Browser
   |
   | HTTP
   v
Express Server
   |
   +-- Upload
   +-- Download
   +-- Delete
   +-- File List
   |
   +-- SQLite
   |
   +-- Local Storage
       |
       +-- storage/files/

All file transfers currently pass through the computer running Mini File Share.

## Future Direction

Mini File Share is being developed toward a more direct device-to-device sharing experience.

Planned areas include:

- Peer-to-peer transfers
- WebRTC-based connections
- Device discovery
- Direct browser-to-browser transfer
- Large-file chunking
- Resumable transfers
- Transfer integrity verification
- Improved transfer speeds
- Better mobile experience

## License

This project is currently provided for personal and educational use.