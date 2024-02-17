// server.js
const express = require('express');
const bodyParser = require('body-parser');
const serialize = require('node-serialize'); // Using node-serialize for serialization

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/api/serialize', (req, res) => {
    const serializedData = req.body.data;
    const deserializedData = serialize.unserialize(serializedData); // Deserialize input data
    
    // Dangerous operation: executing arbitrary code
    console.log(deserializedData); // This will execute any code passed as the serialized object

    res.send('Data processed successfully');
});

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
