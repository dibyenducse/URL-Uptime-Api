/*
Title: Handle Request and Response
Description: To handle res and req
Author:Dibyendu 

*/

//module skuffloding
const handler = {};

handler.notFoundHandler = (requestProperties, callback) => {
    console.log(requestProperties);
    callback(404, {
        message: 'Your requested url is not FOUND',
    });
};

//module exports
module.exports = handler;
