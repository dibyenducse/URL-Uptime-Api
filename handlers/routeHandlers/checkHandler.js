/*
Title: check handler
Description: user check  handler
Author:Dibyendu 

*/

//dependencies
const data = require('../../lib/data');
const { parseJSON, createRandomString } = require('../../helpers/utilities');
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
        typeof requestProperties.body.successCodes === 'object' &&
        requestProperties.body.successCodes instanceof Array
            ? requestProperties.body.successCodes
            : false;
    let timeOutSeconds =
        typeof requestProperties.body.timeOutSeconds === 'number' &&
        requestProperties.body.timeOutSeconds % 1 === 0 &&
        requestProperties.body.timeOutSeconds > 1 &&
        requestProperties.body.timeOutSeconds < 5
            ? requestProperties.body.timeOutSeconds
            : false;

    console.log(protocol);
    console.log(url);
    console.log(method);
    console.log(successCodes);
    console.log(timeOutSeconds);

    if (protocol && url && method && successCodes && timeOutSeconds) {
        //token check
        let token =
            typeof requestProperties.headersObject.token === 'string'
                ? requestProperties.headersObject.token
                : false;

        //lookup the user's phone by reading token
        data.read('tokens', token, (err, tokenData) => {
            if (!err && tokenData) {
                let userPhone = parseJSON(tokenData).phone;
                console.log(userPhone);
                //lookup the user data
                data.read('users', phone, (err, userData) => {
                    if (!err && userData) {
                        tokenHandler._token.verify(
                            token,
                            phone,
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
                                        const checkObjects = {
                                            id: checkId,
                                            userPhone: phone,
                                            protocol: protocol,
                                            url: url,
                                            method: method,
                                            successCodes: successCodes,
                                            timeOutSeconds: timeOutSeconds,
                                        };
                                        console.log(checkObjects);
                                        //save the object
                                        data.create(
                                            'checks',
                                            checkId,
                                            checkObjects,
                                            (err) => {
                                                if (!err) {
                                                    //add checkid to the user's object
                                                    userObject.checks =
                                                        userChecks;
                                                    userObject.checks.push(
                                                        checkId
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
                                                                    checkObjects
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
                                            error: 'User has already reached max check limit. ',
                                        });
                                    }
                                }
                            }
                        );
                    } else {
                        callback(403, {
                            error: 'User not found in database.',
                        });
                    }
                });
            } else {
                callback(403, {
                    error: 'Authentication Problem',
                });
            }
        });
    } else {
        callback(403, {
            error: 'there is a problem in your input',
        });
    }
};

handler._check.get = (requestProperties, callback) => {
    //check the phone number if valid
    const phone =
        typeof requestProperties.queryStringObject.phone === 'string' &&
        requestProperties.queryStringObject.phone.trim().length === 11
            ? requestProperties.queryStringObject.phone
            : false;
};

handler._check.put = (requestProperties, callback) => {};

handler._check.delete = (requestProperties, callback) => {};

module.exports = handler;
