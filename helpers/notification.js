/*
Title: Notification library
Description: important functions to notify users
Author:Dibyendu 

*/

//dependencies
const https = require('https');
const { twilio } = require('./enviroments');
const querystring = require('querystring');
//module scuffolding
const notification = {};

//send sms to user using twilio api
notification.sendTwilioSms = (phone, sms, callback) => {
    //input validation, twilio recommandation
    const userPhone =
        typeof phone === 'string' && phone.trim().length === 11
            ? phone.trim()
            : false;
    const userMsg =
        typeof msg === 'string' &&
        msg.trim().length > 0 &&
        msg.trim().length < 1600
            ? msg.trim()
            : false;
    if (userPhone && userMsg) {
        //configure the request payload
        const payload = {
            From: twilio.fromPhone,
            To: `+88${userPhone}`,
            Body: userMsg,
        };
        //stringify the payload
        const stringifyPayload = querystring.stringify(payload);
        //configure the request details
        const requestDetails = {
            hostname: 'api.twilio.com',
            method: 'POST',
            path: ``,
        };
    } else {
        callback('Given input invalid');
    }
};

exports.module = notification;
