const multer = require("multer");
const admin = require("")
const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const storage = admin.storage().bucket();
const bucket = require('../config/firebase');

const upload = multer({ storage: multer.memoryStorage() });

router.post("/post-avatar", upload.single('avatar'), (req, res) => {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const blob = bucket.file(Date.now() + '-' + file.originalname);
        const blobStream = blob.createWriteStream({
            metadata: {
                contentType: file.mimetype,
            },
        });

        blobStream.on('error', (err) => {
            console.error('Error uploading file:', err);
            return res.status(500).json({ error: 'Upload failed' });
        });

        blobStream.on('finish', async () => {
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

            res.status(200).json({ message: 'File uploaded successfully', fileUrl: publicUrl });
        });

        blobStream.end(file.buffer);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Something went wrong!' });

    }
});

module.exports = router;