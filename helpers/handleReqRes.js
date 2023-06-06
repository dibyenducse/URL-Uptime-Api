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

    //choose which handler function will call
    //request er path theke routes object er vitor path dhukiye chosenHandler er assign hocche value hisebe
    var chosenHandler = routes[trimmedPath]
        ? routes[trimmedPath]
        : notFoundHandler;
    //var chosenHandler = routes[trimmedPath] || notFoundHandler;

    //Data which came from request body
    req.on('data', (buffer) => {
        realData += decoder.write(buffer);
    });

    //after finishing & getting Buffer Data
    req.on('end', () => {
        realData += decoder.end();

        //input the real data to RequestProperties obj before call chosenHandler function

        requestProperties.body = parseJSON(realData);

        //this function will call through different handler function
        chosenHandler(requestProperties, (statusCode, payload) => {
            //every handler function will return a statuscode and paylod for response to client
            statusCode = typeof statusCode === 'number' ? statusCode : 500;
            payload = typeof payload === 'object' ? payload : {};

            const payloadString = JSON.stringify(payload);

            ///return the final response
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);
        });
    });
};
module.exports = handler;
