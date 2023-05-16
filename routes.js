/*
Title: Handle Request and Response
Description: To handle res and req
Author:Dibyendu 

*/

//dependencies
const sampleHandler = require('./handlers/routeHandlers/sampleHandler');
//const notFoundHandler = require('./handlers/routeHandlers/notFoundHandler');

const routes = {
    sample: sampleHandler,
};

module.exports = routes;
