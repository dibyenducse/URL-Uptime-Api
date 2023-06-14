/*
Title: Server Library
Description: server related files
Author: Dibyendu
Bloombrain
*/

//Dependencies
const http = require('http');
const { handleReqRes } = require('../helpers/handleReqRes');
// const data = require('./lib/data');
const enviroment = require('../helpers/enviroments');
// const { sendTwilioSms } = require('./helpers/notification');

// App object- module scaffolfing
const server = {};

//For testing
// sendTwilioSms('01671379417', 'Hello World', (err) => {
//     console.log(err);
// });
/*
data.create(
    'test',
    'newText',
    { name: 'dibbo', language: 'JavaScript' },
    (err) => {
        console.log(err);
    }
);
*/
/*
data.delete('test', 'newFile', (err) => {
    console.log(err);
});
*/

//configuration
server.config = {
    port: 2000,
};

// create server

server.createServer = () => {
    const createServerVariable = http.createServer(server.handleReqRes);
    createServerVariable.listen(server.config.port, () => {
        console.log(`enviroment variable is ${process.env.NODE_ENV}`);
        console.log(`Listenting to port ${server.config.port}`);
    });
};

//handle Req and Res
server.handleReqRes = handleReqRes;

//start the server
server.init = () => {
    server.createServer();
};

module.exports = server;
