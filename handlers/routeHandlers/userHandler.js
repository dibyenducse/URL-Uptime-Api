/*
Title: Handler to handle USER request
Description: User related data handler
Author:Dibyendu 

*/

//dependencies
const data = require('../../lib/data');
const { hash } = require('../../helpers/utilities');

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

    callback(200, {
        message: 'This is a user url',
    });
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
    const tosAgreement =
        typeof requestProperties.body.tosAgreement === 'boolean' &&
        requestProperties.body.tosAgreement.length > 0
            ? requestProperties.body.tosAgreement
            : false;

    if (firstName && lastName && phone && password && tosAgreement) {
        //make sure that user doesn't exist
        data.read('users', phone, (err) => {
            if (err) {
                let userObject = {
                    firstName,
                    lastName,
                    phone,
                    password: hash(password),
                    tosAgreement,
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
                    error: 'There was a problem',
                });
            }
        });
    } else {
        callback(400, {
            error: 'you have problem in your request',
        });
    }
};

handler._users.get = (requestProperties, callback) => {};

handler._users.put = (requestProperties, callback) => {};

handler._users.delete = (requestProperties, callback) => {};

module.exports = handler;
