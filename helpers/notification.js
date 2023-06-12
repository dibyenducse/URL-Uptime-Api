/*
Title: Notification library
Description: important functions to notify users
Author:Dibyendu 

*/

//dependencies
const https = require('https');
const { twilion } = require('./enviroments');
const querystring = require('querystring');
//module scuffolding
const notification = {};

//send sms to user using twilio api
notification.sendTwilioSms = (phone, msg, callback) => {
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
            body: userMsg,
            from: twilion.fromPhone,
            to: `+88${userPhone}`,
        };

        //stringify the payload
        const stringifyPayload = querystring.stringify(payload);
        //configure the request details
        const requestDetails = {
            hostname: 'api.twilio.com',
            method: 'POST',
            path: `2010-04-01/Accounts/AC4f3e7b9cef713afa8f556964bd1bb4c0/Messages.json`,
            auth: `${twilion.accountSid}: ${twilion.authToken}`,
            headers: {
                'Content-Type': 'aplication/x=ww=form-urlencoded',
            },
        };
        //instantiate request object
        const req = https.request(requestDetails, (res) => {
            //get the status of the sent request
            const status = res.statusCode;
            //calllback successfully if the request went through
            if (status === 200 || status === 201) {
            } else {
                callback(`Status code returned was ${status}`);
            }
        });

        req.on('error', (e) => {
            callback(e);
        });

        req.write(stringifyPayload);
        req.end();
    } else {
        callback('Given input invalid');
    }
};

module.exports = notification;
