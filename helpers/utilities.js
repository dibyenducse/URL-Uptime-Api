/*
Title: Utilities
Description: Important utilities functions
Author:Dibyendu 
*/

//Dependencies
const crypto = require('crypto');
const enviroments = require('./enviroments');
//module skuffolding
const utilities = {};

// parse JSON string to Object
utilities.parseJSON = (jsonString) => {
    let output = {};

    try {
        output = JSON.parse(jsonString);
    } catch {
        output = {};
    }
    return output;
};

// Hashing
utilities.hash = (str) => {
    if (typeof str === 'string' && str.length > 0) {
        console.log(enviroments, process.env.NODE_ENV);
        let hash = crypto
            .createHmac('sha256', enviroments.secretKey)
            .update(str)
            .digest('hex');
        return hash;
    } else {
        return false;
    }
};

// Create random string
utilities.createRandomString = (strstringLength) => {
    let length = strstringLength;
    length =
        typeof strstringLength === 'number' && strstringLength > 0
            ? strstringLength
            : false;
    if (length) {
        let possibleCharecters = 'abcdefghijklmnopqrstuvwxyz1234567890';
        let output = '';
        for (let i = 0; i <= length; i++) {
            let randomCharecter = possibleCharecters.charAt(
                Math.floor(Math.random() * possibleCharecters.length)
            );
            output += randomCharecter;
        }
        return output;
    } else {
        return false;
    }
};

//export module
module.exports = utilities;
