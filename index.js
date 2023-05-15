/*
Title: URL Uptime Api
Author: Dibyendu
Bloombrain
*/

//Dependencies
const http = require('http');
const { config } = require('process');

// App object- module scaffolfing
const app = {};

//configuration
app.config = {
    port: 3000,
};

// create server

app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(app.config.port, () => {
        console.log(`Listenting to port ${app.config.port}`);
    });
};

//handle Req Res
app.handleReqRes = (req, res) => {
    //response handle
    res.end('hello world');
};

//start the server

app.createServer();
