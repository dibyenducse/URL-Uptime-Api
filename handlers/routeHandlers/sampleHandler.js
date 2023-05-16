/*
Title: Handle Request and Response
Description: To handle res and req
Author:Dibyendu 

*/

//module skuffloding
const handler = {};

handler.sampleHandler = (requestProperties, callback) => {
    console.log(requestProperties);
    callback(200, {
        message: 'This is a sample url',
    });
};

module.exports = handler;
