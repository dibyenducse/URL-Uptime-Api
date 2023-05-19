/*
Title: Handler to handle USER request
Description: User related data handler
Author:Dibyendu 

*/

//module skuffloding
const handler = {};

handler.userHandler = (requestProperties, callback) => {
    callback(200, {
        message: 'This is a user url',
    });
};

module.exports = handler;
