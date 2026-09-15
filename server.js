const express = require("express");
const multer = require("multer");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const crypto = require("crypto");
const fs = require("fs");

const app = express();

const storageDir = path.join(__dirname, "storage", "files");
const dataDir = path.join(__dirname, "data");

fs.mkdirSync(storageDir, { recursive: true });
fs.mkdirSync(dataDir, { recursive: true });

const db = new sqlite3.Database(
    path.join(dataDir, "files.db")
);

db.run(`
    CREATE TABLE IF NOT EXISTS files (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        stored_name TEXT NOT NULL,
        size INTEGER NOT NULL,
        type TEXT,
        created_at TEXT NOT NULL
    )
`);

const upload = multer({
    storage: multer.diskStorage({
        destination: storageDir,

        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            const name = crypto.randomUUID() + ext;

            cb(null, name);
        }
    })
});

app.use(express.static("public"));

app.post("/upload", upload.single("file"), (req, res) => {
    const id = crypto.randomUUID();

    const f = req.file;

    db.run(
        `
        INSERT INTO files
        (id, name, stored_name, size, type, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
            id,
            f.originalname,
            f.filename,
            f.size,
            f.mimetype,
            new Date().toISOString()
        ],
        (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    msg: "Database error"
                });
            }

            res.json({
                msg: "File uploaded",
                id
            });
        }
    );
});

app.get("/files", (req, res) => {
    db.all(
        `
        SELECT id, name, size, type, created_at
        FROM files
        ORDER BY created_at DESC
        `,
        (err, rows) => {
            if (err) {
                return res.status(500).json({
                    msg: "Database error"
                });
            }

            res.json(rows);
        }
    );
});

app.get("/download/:id", (req, res) => {
    db.get(
        "SELECT * FROM files WHERE id = ?",
        [req.params.id],
        (err, row) => {
            if (err) {
                return res.status(500).json({
                    msg: "Database error"
                });
            }

            if (!row) {
                return res.status(404).json({
                    msg: "File not found"
                });
            }

            const file = path.join(storageDir, row.stored_name);

            res.download(file, row.name);
        }
    );
});

app.delete("/files/:id", (req, res) => {
    db.get(
        "SELECT * FROM files WHERE id = ?",
        [req.params.id],
        (err, row) => {
            if (err) {
                return res.status(500).json({
                    msg: "Database error"
                });
            }

            if (!row) {
                return res.status(404).json({
                    msg: "File not found"
                });
            }

            const file = path.join(storageDir, row.stored_name);

            fs.unlink(file, (err) => {
                if (err) {
                    return res.status(500).json({
                        msg: "File delete failed"
                    });
                }

                db.run(
                    "DELETE FROM files WHERE id = ?",
                    [req.params.id],
                    (err) => {
                        if (err) {
                            return res.status(500).json({
                                msg: "Database error"
                            });
                        }

                        res.json({
                            msg: "File deleted"
                        });
                    }
                );
            });
        }
    );
});

app.listen(3000, "0.0.0.0", () => {
    console.log("Server running on port 3000");
});