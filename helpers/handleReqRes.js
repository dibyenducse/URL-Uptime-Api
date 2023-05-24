/*
Title: Handle Request and Response
Description: To handle res and req
Author:Dibyendu 

*/
//Dependencies
const url = require('url');
const { StringDecoder } = require('string_decoder');
const {
    notFoundHandler,
} = require('../handlers/routeHandlers/notFoundHandler');
const routes = require('../routes');
const { parseJSON } = require('./utilities');

//module or Object Skuffloding
const handler = {};

//handle Req Res
handler.handleReqRes = (req, res) => {
    //request handling

    //get the url and parse it
    const parsedUrl = url.parse(req.url, true);
    //for getting correct path name
    const path = parsedUrl.pathname;
    //trimmed unwanted symbol
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');
    //to get url method
    const method = req.method.toLowerCase();
    // to know querryString
    const queryStringObject = parsedUrl.query;
    //to get headers
    const headersObject = req.headers;

    const requestProperties = {
        parsedUrl,
        path,
        trimmedPath,
        method,
        queryStringObject,
        headersObject,
    };

    //to convert Buffer into data
    const decoder = new StringDecoder('utf-8');

    //collect real data
    let realData = '';

    var chosenHandler = routes[trimmedPath]
        ? routes[trimmedPath]
        : notFoundHandler;
    //var chosenHandler = routes[trimmedPath] || notFoundHandler;

    req.on('data', (buffer) => {
        realData += decoder.write(buffer);
    });

    req.on('end', () => {
        realData += decoder.end();

        requestProperties.body = parseJSON(realData);

        chosenHandler(requestProperties, (statusCode, payload) => {
            statusCode = typeof statusCode === 'number' ? statusCode : 500;
            payload = typeof payload === 'object' ? payload : {};

            const payloadString = JSON.stringify(payload);

            ///return the final response
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);
        });

        // console.log(realData);
        // res.end('Hello World');
    });
};
module.exports = handler;
