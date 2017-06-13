/**
 *      Custom Server Loging Module
 */
var CustomLogging = (function () {

    /**
     *      Dependencies
     */
    var fs = require('fs');
    var util = require('util');
    var filePath = __dirname + '/logs.log';



    /**
     *      Global variables
     */


    /**
     *      Write to log
     */
    var write = function (str) {

        str += '\r\n';

        // fs.writeFile(filePath, str, function (err) {
        //     if (err)
        //         console.error(err);
        //     console.log('Written!');
        // });

        fs.appendFile(filePath, str, function (err) {
            if (err)
                console.error('(SERVER ACTION): Write log...error' + err);
            console.log('(SERVER ACTION): Write log successful...');
        });
    };


    /**
     *      Public exports
     */
    var PUBLIC_METHODS = {

        write: write
    };

    return PUBLIC_METHODS;

})();

module.exports = CustomLogging;