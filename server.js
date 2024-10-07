// const express = require('express');
// const multer = require('multer');
// const fs = require('fs');
// const path = require('path');
// const { v4: uuidv4 } = require('uuid'); // To generate unique identifiers
// const axios = require('axios');

// const app = express();
// const PORT = process.env.PORT || 3131;

// // Middleware for handling JSON and URL-encoded form data
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Function to check if the Base64 data corresponds to a valid PDF
// const isValidBase64 = (data) => {
//     const buffer = Buffer.from(data, 'base64');
//     return buffer.toString('utf-8', 0, 4) === '%PDF'; // Checks if the first four bytes correspond to PDF signature
// };

// // Configure multer for file uploads
// const storage = multer.memoryStorage(); // Use memory storage to access file buffer
// const upload = multer({ storage: storage });

// // Create a public directory to serve uploaded files
// const publicDir = path.join(__dirname, 'public');
// if (!fs.existsSync(publicDir)) {
//     fs.mkdirSync(publicDir);
// }

// // Store uploaded files metadata
// const uploadedFiles = {};

// const sendToAPI = async (fileId) => {
//     const fileData = uploadedFiles[fileId];
    
//     if (!fileData) {
//         console.log('File not found.');
//         return;
//     }

//     const response = await axios.post('https://sales-room.com/api/1.1/wf/grin', {
//         file: fileData.data // Use the Base64 encoded data directly
//     }, {
//         headers: {
//             'Authorization': 'Bearer 17646e8f6cac3837900af528ba6c3460',
//             'Content-Type': 'application/json'
//         }
//     });

//     console.log('Response from API:', response.data);
// };

// // API route for uploading PDFs
// app.post('/upload', upload.single('pdf'), (req, res) => {
//     if (!req.file || req.file.mimetype !== 'application/pdf') {
//         return res.status(400).json({ error: 'Please upload a valid PDF file.' });
//     }

//     // Replace spaces in the original file name with underscores
//     const originalFileName = req.file.originalname.replace(/ /g, '_'); // Replace spaces with underscores

//     // Encode the file buffer in Base64
//     const base64Data = req.file.buffer.toString('base64');
    
//     // Validate the Base64 data
//     if (!isValidBase64(base64Data)) {
//         return res.status(400).json({ error: 'Uploaded file is not a valid PDF.' });
//     }

//     // Generate a unique identifier for the file
//     const fileId = uuidv4();

//     // Store the Base64 data with the unique identifier
//     uploadedFiles[fileId] = {
//         name: originalFileName,
//         data: base64Data,
//     };

//     // Construct the public URL
//     const fileUrl = `http://localhost:${PORT}/pdf/${fileId}`;

//     sendToAPI(fileId);

//     // Respond with the file URL
//     res.status(200).json({ message: 'File uploaded successfully!', url: fileUrl });
// });

// // Route to serve the Base64 encoded PDF
// app.get('/pdf/:id', (req, res) => {
//     const fileId = req.params.id;
//     const fileData = uploadedFiles[fileId];

//     if (!fileData) {
//         return res.status(404).json({ error: 'File not found.' });
//     }

//     // Decode the Base64 data
//     const pdfBuffer = Buffer.from(fileData.data, 'base64');

//     // Set headers to indicate a PDF file
//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', `inline; filename="${fileData.name}"`);

//     // Send the PDF buffer
//     res.send(pdfBuffer);
// });

// // Start the server
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });


const axios = require('axios');
const fs = require('fs');

// const url = 'https://e431422b3bc058d2cc2c9fa78d6a3c05.cdn.bubble.io/f1727952161706x656574872309869400/v179827.pdf';
const url = 'http://138.197.185.152:3131/public/1728305324058-Lopez_The_Second_Glance_Bode_Museum_2020.pdf'
const isValidBase64 = (data) => {
    const buffer = Buffer.from(data, 'base64');
    return buffer.toString('utf-8', 0, 4) === '%PDF'; // Checks if the first four bytes correspond to PDF signature
};

const checkPDF = async (pdfUrl) => {
    try {
        // Download the PDF file
        const response = await axios.get(pdfUrl, { responseType: 'arraybuffer' });
        const pdfBuffer = Buffer.from(response.data);

        // Encode the PDF buffer in Base64
        const base64Data = pdfBuffer.toString('base64');

        // Validate if the Base64 data corresponds to a valid PDF
        if (isValidBase64(base64Data)) {
            console.log('The file is a valid PDF and is Base64 encoded.');
        } else {
            console.log('The Base64 data does not represent a valid PDF.');
        }

    } catch (error) {
        console.error('Error downloading or processing the PDF:', error);
    }
};

checkPDF(url);
