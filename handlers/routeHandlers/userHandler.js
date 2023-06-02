/*
Title: Handler to handle USER request
Description: User related data handler
Author:Dibyendu 

*/

//dependencies
const data = require('../../lib/data');
const { hash, parseJSON } = require('../../helpers/utilities');
const tokenHandler = require('./tokenHandler');

//module skuffloding
const handler = {};

handler.userHandler = (requestProperties, callback) => {
    const acceptedMethods = ['put', 'get', 'post', 'delete'];
    //check the methods
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        handler._users[requestProperties.method](requestProperties, callback);
    } else {
        callback(405); //request don't allow
    }
};

//another module scuffolding

handler._users = {};

//new user create
handler._users.post = (requestProperties, callback) => {
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
    // const tosAgreement =
    //     typeof requestProperties.body.tosAgreement === 'boolean'
    //         ? requestProperties.body.tosAgreement
    //         : null;

    console.log(firstName);
    console.log(lastName);
    console.log(phone);
    console.log(password);
    // console.log(tosAgreement);

    if (firstName && lastName && phone && password) {
        //make sure that user doesn't exist

        data.read('users', phone, (err) => {
            if (err) {
                let userObject = {
                    firstName,
                    lastName,
                    phone,
                    password: hash(password),
                    //tosAgreement,
                };

                //store the user to DB
                data.create('users', phone, userObject, (err) => {
                    if (!err) {
                        callback(200, {
                            message: 'User was created successfully',
                        });
                    } else {
                        callback(500, { error: 'Could not create user!' });
                    }
                });
            } else {
                callback(500, {
                    error: 'User already exists',
                });
            }
        });
    } else {
        callback(400, {
            error: 'you have problem in your request',
        });
    }
};

//send user details to client
handler._users.get = (requestProperties, callback) => {
    //check the phone number if valid
    const phone =
        typeof requestProperties.queryStringObject.phone === 'string' &&
        requestProperties.queryStringObject.phone.trim().length === 11
            ? requestProperties.queryStringObject.phone
            : false;

    if (phone) {
        //verify the token
        let token =
            typeof requestProperties.headersObject.token === 'string'
                ? requestProperties.headersObject.token
                : false;

        tokenHandler._token.verify(token, phone, (tokenId) => {
            if (tokenId) {
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
                callback(403, {
                    error: 'Authentication Failure',
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
handler._users.put = (requestProperties, callback) => {
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
            //verify the token
            let token =
                typeof requestProperties.headersObject.token === 'string'
                    ? requestProperties.headersObject.token
                    : false;

            tokenHandler._token.verify(token, phone, (tokenId) => {
                if (tokenId) {
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
                            callback(403, {
                                error: 'Authentication Failure',
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

handler._users.delete = (requestProperties, callback) => {
    //check the phone number if valid
    const phone =
        typeof requestProperties.queryStringObject.phone === 'string' &&
        requestProperties.queryStringObject.phone.trim().length === 11
            ? requestProperties.queryStringObject.phone
            : false;
    if (phone) {
        //verify the token
        let token =
            typeof requestProperties.headersObject.token === 'string'
                ? requestProperties.headersObject.token
                : false;

        tokenHandler._token.verify(token, phone, (tokenId) => {
            if (tokenId) {
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
                callback(403, {
                    error: 'Authentication Failure',
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
