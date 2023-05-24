/*
Title: URL Uptime Monitoring Application
Description: A RESTFul API to monitor up or down time of user defined links
Author: Dibyendu
Bloombrain
*/

//Dependencies
const http = require('http');
const { handleReqRes } = require('./helpers/handleReqRes');
const data = require('./lib/data');
const enviroment = require('./helpers/enviroments');

// App object- module scaffolfing
const app = {};

//For testing
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
// app.config = {
//     port: 2000,
// };

// create server

app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(enviroment.port, () => {
        console.log(`enviroment variablr is ${process.env.NODE_ENV}`);
        console.log(`Listenting to port ${enviroment.port}`);
    });
};

//handle Req and Res
app.handleReqRes = handleReqRes;

//start the server
app.createServer();
