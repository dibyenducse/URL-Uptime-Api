/*
Title: worker Library
Description: worker related files
Author: Dibyendu
Bloombrain
*/

//Dependencies
const url = require('url');
const data = require('./data');
const http = require('http');
const https = require('https');
const { sendTwilioSms } = require('../helpers/notification');
const { parseJSON } = require('../helpers/utilities');
// App object- module scaffolfing
const worker = {};

//lookup all the checks
worker.gatherAllChecks = () => {
    //get all the checks
    data.list('checks', (err, checks) => {
        if (!err && checks && checks.length > 0) {
            checks.forEach((check) => {
                //read the checkdata
                data.read('checks', check, (err, originalCheckData) => {
                    if (!err && originalCheckData) {
                        //pass the data to the check validator
                        worker.validateCheckData(parseJSON(originalCheckData));
                    } else {
                        console.log('Error: reading on the check');
                    }
                });
            });
        } else {
            console.log('Error: could not find any checks to process');
        }
    });
};

//validate check data
worker.validateCheckData = (originalCheckData) => {
    let originalData = originalCheckData;
    if (originalCheckData && originalCheckData.id) {
        originalData.state =
            typeof originalCheckData.state === 'string' &&
            ['up', 'down'].indexOf(originalCheckData.state) > -1
                ? originalCheckData.state
                : 'down';

        originalData.lastChecked =
            typeof originalCheckData.lastChecked === 'number' &&
            originalCheckData.lastChecked > 0
                ? originalCheckData.lastChecked
                : false;
    } else {
        console.log('Error: check was invalid');
    }
};

// perform check
worker.performCheck = (originalCheckData) => {
    //prepare the initial check outcome
    let checkOutCome = {
        error: false,
        responseCode: false,
    };
    //mark the outCome has not been sent yet
    let outComeSent = false;

    //parse the hostname and full url from original data
    let parsedUrl = url.parse(
        originalCheckData.protocol + '://' + originalCheckData.url,
        true
    );
    let hostname = parsedUrl.hostname;
    let path = parsedUrl.path;

    //construct the request
    const requestDetails = {
        protocol: originalCheckData.protocol + ':',
        hostname: hostname,
        method: originalCheckData.method.toUpperCase(),
        path: path,
    };

    const protocolToUse = originalCheckData.protocol === 'http' ? http : https;

    let req = protocolToUse.request(requestDetails, (res) => {
        //grab the status of the request
        const status = res.statusCode;

        //update the check outcome and pass to the next process
        checkOutCome.responseCode = status;
        if (!outComeSent) {
            worker.processCheckOutCome(originalCheckData, checkOutCome);
            outComeSent = true;
        }
    });

    req.on('error', (e) => {
        checkOutCome = {
            error: true,
            value: e,
        };
        //update the check outcome and pass to the next process
        if (!outComeSent) {
            worker.processCheckOutCome(originalCheckData, checkOutCome);
            outComeSent = true;
        }
    });
    //req send
    req.end();
};
//save check out come to database and send to next process
worker.processCheckOutCome = (originalCheckData, checkOutCome) => {
    //check if checkoutcome is up or down
    let state =
        !checkOutCome.error &&
        originalCheckData.successCodes.indexOf(checkOutCome.responseCode) > -1
            ? 'up'
            : 'down';
    //decide whether we should alert the user or not
    let alartWanted =
        originalCheckData.lastChecked && originalCheckData.state != state
            ? true
            : false;
    //update the check data
    let newCheckData = originalCheckData;
    newCheckData.state = state;
    newCheckData.lastChecked = Date.now();

    //update the check to disk
    data.update('checks', newCheckData, (err) => {
        if (!err) {
            if (alartWanted) {
                worker.alertUserToStatusChange(newCheckData);
            } else {
                console.log('Alert is not needed');
            }
        } else {
            console.log('error trying to save check data ');
        }
    });
};

//send notification sms to user if state changes
worker.alertUserToStatusChange = (newCheckData) => {
    let msg = `Alert: Your check for ${newCheckData.method.toUpperCase()} ${
        newCheckData.protocol
    }: //${newCheckData.url} is currently ${newCheckData.state}}`;

    sendTwilioSms(newCheckData.userPhone, msg, (err) => {
        if (!err) {
            console.log(`User was alerted to a status change sms: ${msg}`);
        } else {
            console.log('There was a problem sending sms to one of the user');
        }
    });
};

//timer the execute to the worker process once per minute
worker.loop = () => {
    setInterval(() => {
        worker.gatherAllChecks();
    }, 1000 * 60);
};

//start the workers
worker.init = () => {
    //execute all the checks

    worker.gatherAllChecks();

    //call the loop so that check will continue
    worker.loop();
};

module.exports = worker;
