/*
Title: Token Handler to handle token request
Description: User token  handler
Author:Dibyendu 

*/

//dependencies
const data = require('../../lib/data');
const { hash, parseJSON } = require('../../helpers/utilities');

//module skuffloding
const handler = {};

handler.tokenHandler = (requestProperties, callback) => {
    const acceptedMethods = ['put', 'get', 'post', 'delete'];
    //check the methods
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        handler._token[requestProperties.method](requestProperties, callback);
    } else {
        callback(405); //request don't allow
    }
};

//another module scuffolding

handler._token = {};

//new token create
handler._token.post = (requestProperties, callback) => {
    const phone =
        typeof requestProperties.body.phone === 'string' &&
        requestProperties.body.phone.trim().length === 11
            ? requestProperties.body.phone
            : false;
    const password =
        typeof requestProperties.body.password === 'string' &&
        requestProperties.body.password.trim().length > 0
            ? requestProperties.body.password
            : false;
    if (phone && password) {
        data.read('users', phone, (err, userData) => {
            let hashedPassword = hash(password);
            if (hashedPassword === userData.password) {
                let tokenId = 
            } else {
                callback(400, {
                    error: 'Password is not valid',
                });
            }
        });
    } else {
        callback(400, {
            error: 'You have a problem in your request',
        });
    }
};

//send user details to client
handler._token.get = (requestProperties, callback) => {
    //check the phone number if valid
    const phone =
        typeof requestProperties.queryStringObject.phone === 'string' &&
        requestProperties.queryStringObject.phone.trim().length === 11
            ? requestProperties.queryStringObject.phone
            : false;

    if (phone) {
        //find user data
        data.read('users', phone, (err, userData) => {
            const user = { ...parseJSON(userData) };
            if (!err && user) {
                delete user.password;
                callback(200, user); //this is _.users.get function 'callback'
            } else {
                callback(404, {
                    error: 'user was not found',
                });
            }
        });
    } else {
        callback(404, {
            error: 'user was not found',
        });
    }
};

//update existing user data
handler._token.put = (requestProperties, callback) => {
    //check the user details if valid
    const firstName =
        typeof requestProperties.body.firstName === 'string' &&
        requestProperties.body.firstName.trim().length > 0
            ? requestProperties.body.firstName
            : false;
    const lastName =
        typeof requestProperties.body.lastName === 'string' &&
        requestProperties.body.lastName.trim().length > 0
            ? requestProperties.body.lastName
            : false;
    const phone =
        typeof requestProperties.body.phone === 'string' &&
        requestProperties.body.phone.trim().length === 11
            ? requestProperties.body.phone
            : false;
    const password =
        typeof requestProperties.body.password === 'string' &&
        requestProperties.body.password.trim().length > 0
            ? requestProperties.body.password
            : false;

    if (phone) {
        if (firstName || lastName || password) {
            //lookup the user
            data.read('users', phone, (err, userDetails) => {
                const userData = { ...parseJSON(userDetails) };
                if (!err && userData) {
                    if (firstName) {
                        userData.firstName = firstName;
                    }
                    if (lastName) {
                        userData.lastName = lastName;
                    }
                    if (password) {
                        userData.password = hash(password);
                    }

                    // restore or update to database
                    data.update('users', phone, userData, (err) => {
                        if (!err) {
                            callback(200, {
                                error: 'User was updated successfully!',
                            });
                        } else {
                            callback(500, {
                                error: 'There was a problem in the serverside',
                            });
                        }
                    });
                } else {
                    callback(400, {
                        error: 'you have a problem in your request!',
                    });
                }
            });
        } else {
            callback(400, {
                error: 'you have a problem in your request',
            });
        }
    } else {
        callback(400, {
            error: 'Invalid phone number, please try again!',
        });
    }
};

handler.token.delete = (requestProperties, callback) => {
    //check the phone number if valid
    const phone =
        typeof requestProperties.queryStringObject.phone === 'string' &&
        requestProperties.queryStringObject.phone.trim().length === 11
            ? requestProperties.queryStringObject.phone
            : false;
    if (phone) {
        //lookup the user
        data.read('users', phone, (err, userData) => {
            if (!err && userData) {
                data.delete('users', phone, (err) => {
                    if (!err) {
                        callback(200, {
                            massage: 'User was successfully deleted',
                        });
                    } else {
                        callback(500, {
                            error: 'there was a problem in server side',
                        });
                    }
                });
            } else {
                callback(500, {
                    error: 'there was a problem server side',
                });
            }
        });
    } else {
        callback(400, {
            error: 'There was a problem in your request',
        });
    }
};

module.exports = handler;
