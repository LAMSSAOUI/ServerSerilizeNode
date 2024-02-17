// server.js
const express = require('express');
const bodyParser = require('body-parser');
const serialize = require('node-serialize'); // Using node-serialize for serialization

const app = express();
const port = 3000;

const validEmails = ['user1@example.com', 'user2@example.com'];

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use(bodyParser.json());

app.post('/api/login', (req, res) => {
    const { username, role, password } = req.body;
    console.log('username now is password', username, password);

    if (validEmails.includes(username)) {
        if (role === 'admin') {
            res.send('valid email and admin'); // Send response for admin role
        } else {
            res.send('valid email and user '); // Send response for non-admin role
        }
    } else {
        res.send('Invalid email. Please try again.');
    }
});

app.get('/dashboard', (req, res) => {
    res.send('Welcome to the dashboard!');
});

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
