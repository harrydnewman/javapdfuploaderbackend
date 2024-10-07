const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const FormData = require('form-data'); // Use form-data for multipart form data

const app = express();
const PORT = process.env.PORT || 3131;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public')); // To serve static files

// Set up multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Function to send the file URL to external API (not the file stream)
const sendToExternalAPI = (publicUrl) => {
    return new Promise((resolve, reject) => {
        console.log('Preparing to send file URL to external API...');
        
        // Prepare headers
        const myHeaders = new fetch.Headers();
        myHeaders.append("Authorization", "Bearer 17646e8f6cac3837900af528ba6c3460");

        const formdata = new FormData();
        console.log('Form data initialized');

        // Append the file URL instead of the file itself
        formdata.append('file', publicUrl);
        console.log('Form data appended with file URL:', publicUrl);

        // Set request options
        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: formdata,
            redirect: 'follow'
        };

        console.log('Sending request to external API...');

        // Send file URL to external API
        fetch("https://sales-room.com/api/1.1/wf/grin", requestOptions)
            .then(response => {
                return response.text();
            })
            .then(result => {
                console.log('External API Response:', result);
                resolve(result);
            })
            .catch(error => {
                console.error('Error sending to external API:', error);
                reject('Error sending to external API');
            });
    });
};

// Endpoint to upload PDF in Base64 format
app.post('/upload', upload.single('file'), (req, res) => {
    console.log('POST /upload called');
    
    if (!req.file) {
        console.log('No file uploaded.');
        return res.status(400).send('No file uploaded.');
    }

    console.log('File uploaded:', req.file);

    // Use the original file name instead of generating a new one
    const originalFileName = req.file.originalname;
    console.log(`Original file name: ${originalFileName}`);

    // Convert the file buffer to Base64
    const base64Data = req.file.buffer.toString('base64');
    console.log('File converted to Base64');

    // Create a PDF file from the Base64 data with the original name
    const filePath = path.join('/var/www/jimmybuffet.rip/public', originalFileName);
    console.log(`File will be saved to: ${filePath}`);

    fs.writeFile(filePath, base64Data, { encoding: 'base64' }, (err) => {
        if (err) {
            console.error('Error saving the file:', err);
            return res.status(500).send('Error saving the file.');
        }

        console.log('File saved successfully');
        // Send back the public URL of the uploaded PDF
        const publicUrl = `https://${req.get('host')}/${path.basename(filePath)}`;
        console.log('Public URL generated:', publicUrl);

        // Call the function to send the file URL to the external API
        sendToExternalAPI(publicUrl)
            .then(apiResponse => {
                // Return the result to the client
                res.json({ url: publicUrl, apiResponse });
            })
            .catch(err => {
                res.status(500).send(err);
            });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
