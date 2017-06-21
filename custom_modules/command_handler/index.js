/**
 *      Command Handler Module
 */
var CommandHandler = (function () {

    /**
     *      Dependencies
     */
    var fs = require('fs');


    /**
     *      Global variables
     */
    var executeCommand = function(command){
        console.log(command);
    };


    /**
     *      Public exports
     */
    var PUBLIC_METHODS = {
        executeCommand: executeCommand
    };

    return PUBLIC_METHODS;

})();

module.exports = CommandHandler;