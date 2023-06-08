/*
Title: Token Handler to handle token request
Description: User token  handler
Author:Dibyendu 

*/

//dependencies
const data = require('../../lib/data');
const { hash, parseJSON } = require('../../helpers/utilities');
const { createRandomString } = require('../../helpers/utilities');
const { token } = require('../../routes');

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

//new token create TODO AUTHENTICATION
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
            if (hashedPassword === parseJSON(userData).password) {
                const tokenId = createRandomString(20);
                const expires = Date.now() + 1200 * 60 * 1000;
                const tokenObject = {
                    phone,
                    id: tokenId,
                    expires,
                };

                //store the token
                data.create('tokens', tokenId, tokenObject, (err) => {
                    if (!err) {
                        callback(200, tokenObject);
                    } else {
                        callback(400, {
                            error: 'there was a problem in server',
                        });
                    }
                });
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

//send token details to client  TODO AUTHENTICATION
handler._token.get = (requestProperties, callback) => {
    //check the token id if valid
    const id =
        typeof requestProperties.queryStringObject.id === 'string' &&
        requestProperties.queryStringObject.id.length === 21
            ? requestProperties.queryStringObject.id
            : false;
    console.log(id);

    if (id) {
        //find token
        data.read('tokens', id, (err, tokenData) => {
            const token = { ...parseJSON(tokenData) };
            if (!err && token) {
                callback(200, token);
            } else {
                callback(404, {
                    error: 'token was not found',
                });
            }
        });
    } else {
        callback(404, {
            error: 'Requested token was not found',
        });
    }
};
//update TODO AUTHENTICATION
handler._token.put = (requestProperties, callback) => {
    const id =
        typeof requestProperties.body.id === 'string' &&
        requestProperties.body.id.trim().length === 21
            ? requestProperties.body.id
            : false;
    const extend =
        typeof requestProperties.body.extend === 'boolean' &&
        requestProperties.body.extend === true
            ? true
            : false;

    console.log(id);
    console.log(extend);
    //check the token if it valid or not
    if (id && extend) {
        data.read('tokens', id, (err, tokenData) => {
            let tokenObject = parseJSON(tokenData);
            if (tokenObject.expires > Date.now()) {
                tokenObject.expires = Date.now() + 60 * 60 * 1000;
                //store the update token
                data.update('tokens', id, tokenObject, (err) => {
                    if (!err) {
                        callback(200);
                    } else {
                        callback(500, {
                            error: 'Update can not possible.',
                        });
                    }
                });
            } else {
                callback(404, {
                    error: 'Token already expired!',
                });
            }
        });
    } else {
        callback(404, {
            error: 'id and extend are false',
        });
    }
};
//delete token TODO AUTHENTICATION
handler._token.delete = (requestProperties, callback) => {
    //check the token id if valid
    const id =
        typeof requestProperties.queryStringObject.id === 'string' &&
        requestProperties.queryStringObject.id.trim().length === 21
            ? requestProperties.queryStringObject.id
            : false;
    if (id) {
        //lookup the token
        data.read('tokens', id, (err, tokenData) => {
            if (!err && tokenData) {
                //delete token data
                data.delete('tokens', id, (err) => {
                    if (!err) {
                        callback(200, {
                            massage: 'Toke was successfully deleted',
                        });
                    } else {
                        callback(500, {
                            error: 'there was a problem in Delete',
                        });
                    }
                });
            } else {
                callback(500, {
                    error: 'there was a problem on token',
                });
            }
        });
    } else {
        callback(400, {
            error: 'Invalid token',
        });
    }
};

handler._token.verify = (id, phone, callback) => {
    data.read('tokens', id, (err, tokenData) => {
        if (!err && tokenData) {
            if (
                parseJSON(tokenData).phone === phone &&
                parseJSON(tokenData).expires > Date.now()
            ) {
                callback(true);
            } else {
                callback(false);
            }
        } else {
            callback(false);
        }
    });
};

module.exports = handler;
