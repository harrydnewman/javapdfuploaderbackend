const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3131;

// Middleware for handling JSON and URL-encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure multer for file uploads
const storage = multer.memoryStorage(); // Use memory storage to access file buffer
const upload = multer({ storage: storage });

// Create a public directory to serve uploaded files
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
}

// API route for uploading PDFs
app.post('/upload', upload.single('pdf'), (req, res) => {
    if (!req.file || req.file.mimetype !== 'application/pdf') {
        return res.status(400).json({ error: 'Please upload a valid PDF file.' });
    }

    // Replace spaces in the original file name with underscores
    const originalFileName = req.file.originalname.replace(/ /g, '_'); // Replace spaces with underscores
    const fileName = `${Date.now()}-${originalFileName}`;
    const filePath = path.join(publicDir, fileName);

    // Write the file to the public directory
    fs.writeFileSync(filePath, req.file.buffer); // Save the file directly from the buffer

    // Construct the public URL
    const fileUrl = `http://138.197.185.152:${PORT}/public/${fileName}`;

    // Respond with the file URL
    res.status(200).json({ message: 'File uploaded successfully!', url: fileUrl });
});

// Serve static files from the public directory
app.use('/public', express.static(publicDir));

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
