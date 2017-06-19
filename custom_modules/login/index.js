/**
 *      Login Module
 */
var Login = (function () {

    /**
     *      Dependencies
     */
    var fs = require('fs');

    /**
     *      Global variables
     */
    var users_location = __dirname + '/users/users.JSON';

    /**
     * 
     */
    var getUsersJSON = function () {

        function fsCallback(err, usersList) {

            //check for config reading errors
            if (err) {
                return console.log("Read users list file error: ", err);
            }

            return usersList;
        }

        return JSON.parse(fs.readFileSync(users_location, 'utf8', fsCallback));
    };

    /**
     * 
     * @param {string} type 
     * @param {string} user 
     * @param {string} pass 
     */
    var findUser = function (user) {

        var type = user.type || 'user',
            username = user.user,
            pass = user.pass;

        var usersList = getUsersJSON();
        var usersByType = usersList[type];

        for (var i = 0; i < usersByType.length; i++) {

            if (usersByType[i].user === username && usersByType[i].pass === pass) {
                return true;
            }
        }
    };


    /**
     * 
     * @param {object} user 
     */
    var registerUser = function (user, autoLogin) {

        //if user is not already registered
        if (!findUser(user)) {

            var type = user.type || 'users',
                username = user.user,
                pass = user.pass;

            fs.readFile(users_location, 'utf8', function (err, usersList) {

                if (err) return console.log(err);

                //parse JSON
                var parsedUsersList = JSON.parse(usersList);

                parsedUsersList[type].push(user);

                //stringify object
                parsedUsersList = JSON.stringify(parsedUsersList);
                //write to file
                fs.writeFile(users_location, parsedUsersList, 'utf8', function (err) {

                    if (err) return console.log(err);
                    console.log("User added!");
                    autoLogin();
                });
            });

        } else {
            console.log("User already exists!");
        };
    };


    /**
     *      Public exports
     */
    var PUBLIC_METHODS = {
        getUsersJSON: getUsersJSON,
        findUser: findUser,
        registerUser: registerUser
    };

    return PUBLIC_METHODS;

})();

module.exports = Login;