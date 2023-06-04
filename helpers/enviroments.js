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
    secretKey: 'gsdfdsfgdsg',
    maxChecks: 5,
};
enviroments.production = {
    port: 5000,
    evnName: 'production',
    secretKey: 'd5fdf5sdf2zxfc',
    maxChecks: 5,
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
