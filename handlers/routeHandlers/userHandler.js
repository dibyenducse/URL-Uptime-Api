/*
Title: Handler to handle USER request
Description: User related data handler
Author:Dibyendu 

*/

//module skuffloding
const handler = {};

handler.userHandler = (requestProperties, callback) => {
    const acceptedMethods = ['put', 'get', 'post', 'delete'];
    //check the methods
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        handleReqRes._users[requestProperties.method](
            requestProperties,
            callback
        );
    } else {
        callback(405); //request don't allow
    }

    callback(200, {
        message: 'This is a user url',
    });
};

//another module scuffolding

handler._users = {};

//new user create
handler._users.post = (requestProperties, callback) => {};

handler._users.get = (requestProperties, callback) => {
    callback(200);
};

handler._users.put = (requestProperties, callback) => {};

handler._users.delete = (requestProperties, callback) => {};

module.exports = handler;
