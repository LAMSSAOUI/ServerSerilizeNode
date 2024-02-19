// const express = require('express');
// const bodyParser = require('body-parser');
// const cookieParser = require('cookie-parser'); // Import cookie-parser
// const serialize = require('node-serialize');
// const cors = require('cors');
// var escape = require('escape-html');

// const app = express();
// const port = 3000;

// const validEmails = ['user1@example.com', 'user2@example.com'];

// app.use(cors());
// app.use(bodyParser.json()); // Use bodyParser.json() to parse JSON bodies
// app.use(cookieParser()); // Use cookieParser middleware

// app.post('/api/login', (req, res) => {
//     const serializedData = req.body; // Assuming the data is sent as JSON

//     console.log('The serialized data is:', serializedData);

//     // Deserialize the serialized data
//     const deserializedData = serialize.unserialize(serializedData)
//     // const deserializedData = deserialize(serializedData);

//     console.log('Deserialized data:', deserializedData);

//     const { username, password } = deserializedData;

//     // Check if the user is already logged in
//     if (req.cookies.profile) {
//         res.send('Already logged in as: ' + req.cookies.profile.username);
//         return;
//     }

//     if (validEmails.includes(username)) {
//         // Set cookie with user profile data
//         res.cookie('profile', JSON.stringify(deserializedData), {
//             maxAge: 900000,
//             httpOnly: true
//         });
//         res.send('Valid credentials. Logging in...');
//     } else {
//         res.send('Invalid email. Please try again.');
//     }
// });

// app.get('/dashboard', (req, res) => {
//     // Check if user is authenticated
//     if (req.cookies.profile) {
//         res.send('Welcome to the dashboard, ' + req.cookies.profile.username + '!');
//     } else {
//         res.send('You are not authenticated.');
//     }
// });
// app.get('/', function(req, res) {
//     if (req.cookies.profile) {
//       var str = new Buffer(req.cookies.profile, 'base64').toString();
//       var obj = serialize.unserialize(str);
//       if (obj.username) {
//         res.send("Hello " + escape(obj.username));
//       }
//     } else {
//         res.cookie('profile', "eyJ1c2VybmFtZSI6ImFqaW4iLCJjb3VudHJ5IjoiaW5kaWEiLCJjaXR5IjoiYmFuZ2Fsb3JlIn0=", {
//           maxAge: 900000,
//           httpOnly: true
//         });
//     }
//     res.send("Hello World");
//    });


// app.listen(port, () => {
//     console.log(`Server is listening at http://localhost:${port}`);
// });


const express = require('express');
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const serialize = require('node-serialize');
const cors = require('cors');
const { Sequelize } = require('sequelize');
// const { Connection } = require('mysql2/typings/mysql/lib/Connection');

const app = express();
const port = 3000;

const validEmails = ['user1@example.com', 'user2@example.com'];

const sequelize = new Sequelize('desiralization', 'root', 'bouskoura2018', {
    host: 'localhost',
    dialect: 'mysql'
});



app.use(cors());
app.use(bodyParser.json()); // Use bodyParser.json() to parse JSON bodies
app.use(cookieParser())

app.post('/api/login', async (req, res) => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        return;
    }
  

    const serializedData = req.body; // Assuming the data is sent as JSON
    console.log('The serialized data is:', serializedData);

    console.log('The serialized data is:', serializedData.data);

    
    const deserializedData = serialize.unserialize(serializedData.data)

    console.log('Deserialized data:', deserializedData);

    const { username, password } = deserializedData;


    const sql = `SELECT * FROM users WHERE name = '${username}' and password = ${password}`;
    try {
        const [rows] = await sequelize.query(sql);
        console.log('rows are ', rows)
        if (rows.length >= 1) {
            res.json(rows);
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error('Error executing SQL query:', error);
        res.status(500).send('Internal Server Error');
    }

});
app.get('/:id', async function (req, res) {
    // Extract id from URL params
    const id = req.params.id;

    // Construct SQL query with the id parameter
    const sql = `SELECT * FROM users WHERE idusers = ${id}`;

    try {
        // Execute the SQL query
        const [rows] = await sequelize.query(sql);
        
        // Send the fetched data as JSON response
        res.json(rows);
    } catch (error) {
        // Handle errors
        console.error('Error executing SQL query:', error);
        res.status(500).send('Internal Server Error');
    }
});


app.get('/api/admin', (req, res) => {
    res.send('Welcome to the admin !');
});

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});

