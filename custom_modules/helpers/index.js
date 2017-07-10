/**
 *      Helpers Module
 */
var Helpers = (function () {

    /**
     *      Dependencies
     */


    /**
     *      Global variables
     */


    /**
     *      Returns a random integer between min and max, if provided, or use default numbers
     */
    var get_randomInteger = function (min, max) {

        //default values, if min and max are not provided
        min = min || 0;
        max = max || 1000;

        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    /**
     * 
     * @param {number} actId 
     */
    var get_ActivityViewById = function (actId) {

        switch (actId) {

            case 1:
                return "ticTacToe.html";
            case 2:
                return "example.html";
            default:
                break;
        };
    };

    /**
     * 
     * @param {string} format 
     */
    function get_date(format) {

        var date = new Date();

        var day = date.getDate(),
            month = date.getMonth() + 1,
            year = date.getFullYear();

        var h = date.getHours(),
            m = date.getMinutes();

        day < 10 ? day = '0' + day : day;
        month < 10 ? month = '0' + month : month;
        h < 10 ? h = '0' + h : h;
        m < 10 ? m = '0' + m : m;

        switch (format) {
            case 'hour':

                var time = h + 'h:' + m + 'm';
                break;

            case 'date':

                var time = day + '/' + month + '/' + year;
                break;
            case 'date and hour':

                var time = day + '/' + month + '/' + year + '  ' + h + 'h:' + m + 'm';
                break;

            default:
                break;
        }

        return time;
    };


    /**
     *      Public exports
     */
    var PUBLIC_METHODS = {
        get_randomInteger: get_randomInteger,
        get_ActivityViewById: get_ActivityViewById,
        get_date: get_date
    };

    return PUBLIC_METHODS;

})();

module.exports = Helpers;