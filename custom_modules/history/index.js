/**
 *      History Handler Module
 */
var HistoryHandler = (function () {

    /**
     *      Dependencies
     */
    var fs = require('fs');


    /**
     *      Global variables
     */
    var history_log = __dirname + '/history/messages.JSON';

    /**
     * 
     */
    var getHistory = function (room) {

        var room = room || "defaultRoom";

        function fsCallback(err, history) {
            
            //check for config reading errors
            if (err) {
                return console.log("Read history error: ", err);
            }
        };

        var msgHistory = JSON.parse(fs.readFileSync(history_log, 'utf8', fsCallback))[room];

        return msgHistory;
    };


    /**
     * 
     * @param {object} message 
     */
    var logHistory = function (room, message) {

        var room = room || "defaultRoom";

        fs.readFile(history_log, 'utf8', function (err, messageHistory) {

            if (err) return console.log(err);

            //parse JSON
            var parsedMessagesList = JSON.parse(messageHistory);

            parsedMessagesList[room].push(message);

            //stringify object
            parsedMessagesList = JSON.stringify(parsedMessagesList);
            //write to file
            fs.writeFile(history_log, parsedMessagesList, 'utf8', function (err) {

                if (err) return console.log(err);
                console.log("Message history updated!");
            });
        });

    };


    /**
     *      Public exports
     */
    var PUBLIC_METHODS = {
        logHistory: logHistory,
        getHistory: getHistory
    };

    return PUBLIC_METHODS;

})();

module.exports = HistoryHandler;