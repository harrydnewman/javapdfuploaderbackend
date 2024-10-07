const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3131;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public')); // To serve static files

// Set up multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Endpoint to upload PDF in Base64 format
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    // Convert the file buffer to Base64
    const base64Data = req.file.buffer.toString('base64');

    // Create a PDF file from the Base64 data
    const filePath = path.join(__dirname, 'public', `${Date.now()}.pdf`);
    fs.writeFile(filePath, base64Data, { encoding: 'base64' }, (err) => {
        if (err) {
            return res.status(500).send('Error saving the file.');
        }

        // Send back the public URL of the uploaded PDF
        const publicUrl = `${req.protocol}://${req.get('host')}/${path.basename(filePath)}`;
        res.json({ url: publicUrl });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
