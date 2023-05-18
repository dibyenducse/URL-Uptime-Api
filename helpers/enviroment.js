/*
Title: Enviroment
Description: Handle all the enviroment from here
Author:Dibyendu 
*/

//Dependencies

//module skuffolding

const enviroments = {};

enviroments.staging = {
    port: 3000,
    envName: 'staging',
};
enviroments.production = {
    port: 5000,
    evnName: 'production',
};

//determine which enviroment was passed
const currentEnviroment =
    typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'staging';

//exports corresponding enviroment object
const enviromentToExport =
    typeof enviroments[currentEnviroment] === 'object'
        ? enviroments[currentEnviroment]
        : enviroments.staging;

//export module
module.exports = enviromentToExport;
