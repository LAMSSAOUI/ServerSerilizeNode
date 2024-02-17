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

const app = express();
const port = 3000;

const validEmails = ['user1@example.com', 'user2@example.com'];

app.use(cors());
app.use(bodyParser.json()); // Use bodyParser.json() to parse JSON bodies
app.use(cookieParser())
app.post('/api/login', (req, res) => {
    const serializedData = req.body; // Assuming the data is sent as JSON
    console.log('The serialized data is:', serializedData.data);

    // Deserialize the serialized data
    const deserializedData = serialize.unserialize(serializedData.data)
    // const deserializedData = deserialize(serializedData);

    console.log('Deserialized data:', deserializedData);

    const { username, password } = deserializedData;

    if (validEmails.includes(username)) {
            res.send('Valid credentials. Logging in...');
        
    } else {
        res.send('Invalid email. Please try again.');
    }
});
app.get('/', function(req, res) {
	if (req.cookies.profile) {
		var str = new Buffer(req.cookies.profile, 'base64').toString();
		var obj = serialize.unserialize(str);
		if (obj.username) {
			res.send("Hello " + escape(obj.username));
		}
	} else {
		res.cookie('profile', "eyJ1c2VybmFtZSI6IkpvaG4iLCJnZW5kZXIiOiJNYWxlIiwiQWdlIjogMzV9", {
			maxAge: 900000,
			httpOnly: true
		});
	}
	res.send("Welcome to the Serialize-Deserialize Demo!");
});

app.get('/dashboard', (req, res) => {
    res.send('Welcome to the dashboard!');
});

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});

