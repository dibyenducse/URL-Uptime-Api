/*
Title: Initial file
Description: initial file to start the node server and workers
Author: Dibyendu
Bloombrain
*/

//Dependencies
const server = require('./lib/server');
const worker = require('./lib/worker');

// App object- module scaffolfing
const app = {};

app.init = () => {
    //start the server
    server.init();
    //start the workers
    worker.init();
};

//start the server
app.init();
