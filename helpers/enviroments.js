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
    twilion: {
        fromPhone: '',
        AccountSid: 'ACbc3ba0a51f3a66af6638235543a6cb30',
        AuthToken: '1eb57cbf52bc2906670d62ed6e9dbb8e',
    },
};
enviroments.production = {
    port: 5000,
    evnName: 'production',
    secretKey: 'd5fdf5sdf2zxfc',
    maxChecks: 5,
    twilion: {
        fromPhone: '',
        AccountSid: 'ACbc3ba0a51f3a66af6638235543a6cb30',
        AuthToken: '1eb57cbf52bc2906670d62ed6e9dbb8e',
    },
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
