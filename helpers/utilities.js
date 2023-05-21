/*
Title: Utilities
Description: Important utilities functions
Author:Dibyendu 
*/

//Dependencies
const crypto = require('crypto');
const enviroment = require('./enviroment');
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
        let hash = crypto.createHmac('shah', enviroment[process.env.NODE_ENV].secretKey);
        .updates(str)
        .digest('hex')
    }
};

//export module
module.exports = parseJSON;
