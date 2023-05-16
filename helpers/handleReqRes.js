/*
Title: Handle Request and Response
Description: To handle res and req
Author:Dibyendu 

*/
//Dependencies
const url = require('url');
const { StringDecoder } = require('string_decoder');

//Skuffloding
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
    //to get Buffer data
    const decoder = new StringDecoder('utf-8');
    let realData = '';
    req.on('data', (buffer) => {
        realData += decoder.write(buffer);

        console.log(realData);

        //response handling
        res.end('Hello World');
    });
};
module.export = handler;
