// Download the helper library from https://www.twilio.com/docs/node/install
// Set environment variables for your credentials
// Read more at http://twil.io/secure
const accountSid = 'AC4f3e7b9cef713afa8f556964bd1bb4c0';
const authToken = 'c5b9ed3e7ef841aff96977e2b8f23b2d';
const client = require('twilio')(accountSid, authToken);
client.messages
    .create({ body: 'Hello from Twilio', from: '', to: '+8801717912422' })
    .then((message) => console.log(message.sid));
