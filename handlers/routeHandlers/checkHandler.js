/*
Title: check handler
Description: user check  handler
Author:Dibyendu 

*/

//dependencies
const data = require('../../lib/data');
const {
    hash,
    parseJSON,
    createRandomString,
} = require('../../helpers/utilities');
const tokenHandler = require('./tokenHandler');
const { maxChecks } = require('../../helpers/enviroments');

//module skuffloding
const handler = {};

handler.checkHandler = (requestProperties, callback) => {
    const acceptedMethods = ['put', 'get', 'post', 'delete'];
    //check the methods
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        handler._check[requestProperties.method](requestProperties, callback);
    } else {
        callback(405); //request don't allow
    }
};

//another module scuffolding

handler._check = {};

handler._check.post = (requestProperties, callback) => {
    //validate inputs
    let protocol =
        typeof requestProperties.body.protocol === 'string' &&
        ['http', 'https'].indexOf(requestProperties.body.protocol) > -1
            ? requestProperties.body.protocol
            : false;
    let url =
        typeof requestProperties.body.url === 'string' &&
        requestProperties.body.url.trim().length > 0
            ? requestProperties.body.url
            : false;
    let method =
        typeof requestProperties.body.method === 'string' &&
        ['get', 'post', 'put', 'delete'].indexOf(
            requestProperties.body.method
        ) > -1
            ? requestProperties.body.method
            : false;
    let successCodes =
        typeof requestProperties.body.method === 'object' &&
        requestProperties.body.successCodes instanceof Array
            ? requestProperties.body.successCodes
            : false;
    let timeOutSeconds =
        typeof requestProperties.body.timeOutSeconds === 'number' &&
        requestProperties.body.timeOutSeconds % 1 === 0 &&
        requestProperties.body.timeOutSeconds >= 1 &&
        requestProperties.body.timeOutSeconds <= 5
            ? requestProperties.body.timeOutSeconds
            : false;

    if (protocol && url && method && successCodes && timeOutSeconds) {
        //token check
        let token =
            typeof requestProperties.headersObject.token === 'string'
                ? requestProperties.headersObject.token
                : false;
        //lookup the userphone by reading token
        data.read('tokens', token, (err, tokenData) => {
            if (!err && tokenData) {
                let userPhone = parseJSON(tokenData).phone;
                //lookup the user data
                data.read('users', userPhone, (err, userData) => {
                    if (!err && userData) {
                        tokenHandler._token.verify(
                            token,
                            userPhone,
                            (tokenIsValid) => {
                                if (tokenIsValid) {
                                    userObject = parseJSON(userData);
                                    let userChecks =
                                        typeof userObject.checks === 'object' &&
                                        userObject.checks instanceof Array //array check korar system
                                            ? userObject.checks
                                            : [];
                                    if (userChecks.length < maxChecks) {
                                        const checkId = createRandomString(20);
                                        const checkObejects = {
                                            id: checkId,
                                            userPhone: userPhone,
                                            protocol: protocol,
                                            url: url,
                                            method: method,
                                            successCodes: successCodes,
                                            timeOutSeconds: timeOutSeconds,
                                        };
                                        //save the object
                                        data.create(
                                            'checks',
                                            checkId,
                                            checkObejects,
                                            (err) => {
                                                if (!err) {
                                                    //add checkid to the user's object
                                                    userObject.checks =
                                                        userChecks;
                                                    userObject.checks.push(
                                                        checkID
                                                    );

                                                    //save the new user data
                                                    data.update(
                                                        'users',
                                                        phone,
                                                        userObject,
                                                        (err) => {
                                                            if (!err) {
                                                                //return the data about the new check
                                                                callback(
                                                                    200,
                                                                    checkObejects
                                                                );
                                                            } else {
                                                                callback(500, {
                                                                    error: 'There are a problem in server side ',
                                                                });
                                                            }
                                                        }
                                                    );
                                                } else {
                                                    callback(500, {
                                                        error: 'There are a problem in server side ',
                                                    });
                                                }
                                            }
                                        );
                                    } else {
                                        callback(403, {
                                            error: 'User not found ',
                                        });
                                    }
                                }
                            }
                        );
                    } else {
                        callback(403, {
                            error: 'User not found ',
                        });
                    }
                });
            } else {
                callback(403, {
                    error: 'Authentication Problem',
                });
            }
        });
    } else
        400,
            {
                error: 'You have a problem in your request',
            };
};

handler._check.get = (requestProperties, callback) => {
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

handler._check.put = (requestProperties, callback) => {
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

handler._check.delete = (requestProperties, callback) => {
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
