/*
Title: worker Library
Description: worker related files
Author: Dibyendu
Bloombrain
*/

//Dependencies
const data = require('./data');
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
    if (originalCheckData && originalCheckData.id) {
    } else {
        console.log('Error: check was invalid');
    }
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
