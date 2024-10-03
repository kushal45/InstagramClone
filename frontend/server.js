const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');

app.use(cors({
    origin: 'http://localhost:3000'
}));
// Serve the static files from the 'user' directory
app.use('/', express.static(path.join(__dirname, 'user')));
app.use('/feed', express.static(path.join(__dirname, 'feed')));
app.use('/public', express.static(path.join(__dirname, 'public')));

// Route to serve index.html by default
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'user', 'index.html'));
});

// Start the server
const port = 3002;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});