/*
Title: Handle Data CRUD Operation    
Description: To handle Data
Author:Dibyendu 

*/
//Dependencies
const fs = require('fs');
const path = require('path');

//module skuffolding
const lib = {};

//base directory of the data folder
lib.basedir = path.join(__dirname, '/../.data');

//write data to file
lib.create = (dir, file, data, callback) => {
    //open file for writing
    fs.open(
        `${lib.basedir}/${dir}/${file}.json`,
        'wx',
        function (err, fileDescriptor) {
            if (!err && fileDescriptor) {
                //convert data to string
                const stringData = JSON.stringify(data);

                //write data to file then close it
                fs.writeFile(fileDescriptor, stringData, function (err) {
                    if (!err) {
                        fs.close(fileDescriptor, function (err) {
                            if (!err) {
                                callback(false);
                            } else {
                                callback('Error writing to new file!');
                            }
                        });
                    } else {
                        callback('error writing to new file!');
                    }
                });
            } else {
                callback(err);
            }
        }
    );
};

//read data from file
lib.read = (dir, file, callback) => {
    fs.readFile(`${lib.basedir}/${dir}/${file}.json`, 'utf8', (err, data) => {
        callback(err, data);
    });
};

//update existing data

lib.update = (dir, file, data, callback) => {
    //file open for writing
    fs.open(
        `${lib.basedir}/${dir}/${file}.json`,
        'r+',
        (err, fileDescriptor) => {
            if (!err && fileDescriptor) {
                //convert the data to string
                const stringData = JSON.stringify(data);

                //truncate the file
                fs.ftruncate(fileDescriptor, (err) => {
                    if (!err) {
                        //write to the file and close it
                        fs.writeFile(fileDescriptor, stringData, (err) => {
                            if (!err) {
                                //close the file
                                fs.close(fileDescriptor, (err) => {
                                    if (!err) {
                                        callback(false);
                                    } else {
                                        callback('Error closing file!');
                                    }
                                });
                            } else {
                                console.log('Error on writing');
                            }
                        });
                    } else {
                        console.log('Error to truncate file');
                    }
                });
            } else {
                console.log('Error on Updating');
            }
        }
    );
};

//delete file

lib.delete = (dir, file, callback) => {
    //unlink the file
    fs.unlink(`${lib.basedir}/${dir}/${file}.json`, (err) => {
        if (!err) {
            callback(false);
        } else {
            console.log('Erron on Delete');
        }
    });
};

//Export

module.exports = lib;
