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
const {DataTypes} = require("sequelize");
const multer = require('multer')
// const { Connection } = require('mysql2/typings/mysql/lib/Connection');

// const upload = multer({ dest: 'uploads/' });


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


// (async () => {
//     await sequelize.sync();
//     console.log('done');
// })();


const File = sequelize.define("File", {
    filename : DataTypes.STRING,
    path : DataTypes.STRING
});

const storage = multer.diskStorage({
    destination : (req , file , cb) => {
        cb(null , "uploads/")
    }, 
    filename : (req , file , cb) => {
        cb(null , file.originalname)
    }
})

const upload = multer({ storage })
// const upload = multer({ dest: 'uploads/' });

app.post('/upload' , upload.single('file'),  async (req , res) => {

    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        return;
    }

    const {originalname , path} = req.file;
    console.log('name of the file is ', originalname)
    console.log('path is ', path)
    
    File.create({ filename : originalname , path })
        .then(() => {
            res.send("File uploaded successfully");
        })
        .catch(err => {
            res.status(500).send('Error uploading the file');
        })
})

app.get("/file/:id", (req , res) => {
    const fileId = req.params.id;
    File.findByPk(fileId)
        .then(file => {
            if (!file) {
                return res.status(404).send("File not found");
            }
            res.download(file.path)
        })
        .catch(err => {
            res.status(500).send("Error fetching the file")
        })
})

app.post('/api/login', async (req, res) => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        return;
    }
  

    const serializedData = req.body; 

    console.log('The serialized data is:', serializedData);

    const deserializedData = serialize.unserialize(serializedData)

    console.log('Deserialized data:', deserializedData);

    const { username, password } = deserializedData;
    // console.log('the username is ', username)

    // eval(username)


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


// Middleware to handle image upload
app.post('/api/admin', upload.single('image'), async (req, res) => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    return res.status(500).send('Internal Server Error');
  }

  // Assuming the image upload field in the form is named 'image'
  const imageFile = req.file;
  if (!imageFile) {
    return res.status(400).send('No image file uploaded');
  }

  // Assuming you want to store the image path in the database
  const imagePath = imageFile.path;

  // Insert image path into the database
  const sql = 'INSERT INTO images (path) VALUES (?)';
  try {
    const [result] = await sequelize.query(sql, [imagePath]);
    console.log('Image uploaded and inserted into database');
    res.json({ imagePath }); // Send back the image path for client-side reference if needed
  } catch (error) {
    console.error('Error inserting image into database:', error);
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

