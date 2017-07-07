/**
 *      Global Constants
 */
const url = window.location.protocol + "//" + window.location.host;
var opt = {
    path: '/socket.io'
};
//socket connection to the server
const socket = io.connect(url, opt);

/**
 *      Caching selectors
 */
var $document = $(document);

var $chat = $('#chat'),
    $chat__allMessages = $('#chat__allMessages'),
    $chat_messageUser = $('.chat__messageUser');
$chat__form = $('#chat__form'),
    $chat__userInput = $('#chat__userInput'),
    $chat__submit = $('#chat__submit'),
    $chat__submitPlaceholder = $('#chat__submitPlaceholder');

var $file = $('#file'),
    $file__input = $('#file__input'),
    $file__submit = $('#file__submit');

var $login = $('#login'),
    $login__form = $('#login__form'),
    $login__userInput = $('#login__userInput'),
    $login__passInput = $('#login__passInput'),
    $login__submit = $('#login__submit'),
    $login__error = $('#login__error'),
    $register__submit = $('#register__submit');

var $users = $('#chat__users'),
    $offline__users = $('#offline__users'),
    $users__list = $('#users__list'),
    $offline__list = $('#offline__list');

var $weather = $('#weather');
var $streaming = $('#streaming');
var $quoteGenerator = $('#guoteGenerator');

var $playground__gamesList = $('#playground__gamesList');
var $playground__activitySpace = $('#playground__activitySpace');


var $tools = $('#tools'),
    $tools__toogleChat = $('#tools__toogleChat'),
    $tools__toggleUsers = $('#tools__toggleUsers'),
    $tools__toggleOfflineUsers = $('#tools__toggleOfflineUsers'),
    $tools__fileSend = $('#tools__fileSend'),
    $tools__streaming = $('#tools__streaming'),
    $tools__games = $('#tools__games'),
    $tools__quotes = $('#tools__quotes'),
    $tools__weather = $('#tools__weather'),
    $tools__signOut = $('#tools__signOut');

var $closeWindow = $('.closeWindow');



/**
 * Find a cookie and returns its value
 * @param {string} name The cookie name
 */
var get_cookieByName = function (name) {

    var p1 = "(?:(?:^|.*;\\s*)";
    var p2 = "\\s*\\=\\s*([^;]*).*$)|^.*$";
    var regex = new RegExp(p1 + name + p2);

    return document.cookie.replace(regex, "$1");
};

/**
 * Get all cookies
 */
var get_all = function () {

    return document.cookie;
};

/**
 * Reset a specific cookie
 * @param {string} name The cookie name
 */
var reset_cookie = function (name) {

    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
};

/**
 * Create and store a new cookie with the provided data
 * @param {string} name The cookie name
 * @param {string} val The cookie value
 */
var set_cookie = function (name, val) {

    if (name && val) document.cookie = name + "=" + val;
};

/**
 * Login user
 * @param {string} user The user name
 * @param {string} pass The user password
 */
var do_login = function (user, pass) {

    socket.emit('user login', {
        user: user,
        pass: pass
    });
};

/**
 * Register new user
 * @param {string} user The user name
 * @param {string} pass The user password
 */
var do_register = function (user, pass) {

    socket.emit('user register', {
        user: user,
        pass: pass
    });
};

/**
 * Logout user
 */
var do_logout = function () {

    reset_cookie("vitUser");
    reset_cookie("vitPass");
    location.reload();
};


/**
 * Global Variables
 */
var usr = get_cookieByName('vitUser') || null; //local saved user name
//var role = get_cookieByName('vitPermissionLevel') || null; //user role
var pass = get_cookieByName('vitPass') || null; //password
var windowFocused = true; //holds the state of the application window (focused or not)


/**
 * Auto login if user already logged
 */
if (!usr && !pass) {
    $login.show();
    $login__userInput.focus();
} else {
    do_login(usr, pass);
};



/**
 * Parse the provided UTC datetime and returns the choosen format date or time
 * @param {string} format The date format to be outputed: hour | date | date and hour
 * @param {string} providedDate UTC date from server
 * @return {string} time The date|time in the choosen format
 */
var get_date = function (format, providedDate) {

    if (providedDate) {
        var date = new Date(providedDate);
    } else {
        var date = new Date();
    }

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
 * Creates html templates for the chat widget mesages
 * @param {object} o All the data for the message
 */
var template_message = function (o) {

    var utcDate = o.utcDate;

    var date = get_date("date", utcDate);
    var time = get_date("hour", utcDate);

    var u = o.usr,
        m = o.msg;

    var regMention = /@[^\s]*/;

    if (regMention.test(m)) {
        var mention = m.match(regMention)[0];
        var customMention = '<span class="userMention">' + mention + '</span>';

        m = m.replace(regMention, customMention);
    }

    //if the message date is the same as today's date, then just display "today"
    if (date === get_date("date")) date = "Today";

    var t = '<li><p class="chat__messageUser">' + u + '</p><span class="chat__messageDate">' + date + ' ' + time + '</span><p class="chat__message"> ' + m + '</p></li>';

    return t;
};

/**
 * Creates html templates for user list items
 * @param {number} id The user id
 * @param {string} n The user name
 * @param {string} role The user role
 */
var template_userlistItem = function (id, n, role) {

    var id = id || "N/A";
    //var role = role || "user";
    var n = n || "Anonymous User";

    var t = '<li data-userId=' + id + ' data-userRole=' + role + '>' + n + '</li>';

    return t;
};

/**
 * Creates html templates for image files, to be appended in the chat widget
 * @param {string} user The name of the user that uploaded the image
 * @param {object} content The image data
 */
var template_imageTransfer = function (user, content) {

    var t, d;
    var img = new Image();

    img.src = content.data;
    img.style.width = 'auto';
    img.style.height = '100px';
    img.style.imageRendering = '-webkit-optimize-contrast';

    d = $('<a class="fileTransfer__image" download="' + content.name + '" href=' + content.data + ' title="' + content.name + '"></a>').append(img);
    t = $('<li><span class="chat__messageUser">' + user + ': </span></li>').append(d);

    return t;
};

/**
 * Creates html templates for text files, to be appended in the chat widget
 * @param {string} user The name of the user that uploaded the file
 * @param {object} content The file data
 */
var template_txtTransfer = function (user, content) {

    var t, d;
    var file = new File([content.data], content.name, {
        type: content.type,
        lastModified: content.lastModifDate
    });

    file.src = content.data;

    d = $('<a class="fileTransfer__text" download="' + content.name + '" href=' + content.data + ' title="' + content.name + '"></a>').append(file);
    t = $('<li><span class="chat__messageUser">' + user + ': </span></li>').append(d);

    return t;
};

/**
 * Displays HTML 5 notifications
 * @param {string} message The notification message that will be displayed
 */
var notify = function (message) {

    var message = message || null;

    // check browser support
    if (!("Notification" in window)) {
        console.log("Notifications are not supported by current browser!")
    } else if (message) {
        switch (Notification.permission) {
            case "granted":
                var notification = new Notification(message);
            case "denied":
                break;
            default:
                Notification.requestPermission(function (permission) {
                    // ask for notifications permission
                    if (permission === "granted") {
                        var notification = new Notification(message);
                    }
                });
        }
    }
};

/**
 * Update chat widget scroll (auto scroll down on new messages)
 */
var update_scroll = function () {

    var h = $chat__allMessages.height();
    var s = $chat__allMessages[0].scrollHeight;
    var bot = Math.floor(s - h);

    $chat__allMessages.scrollTop(bot);
};

/**
 * Update the online users list
 * @param {string} action The action to be taken: add | add all | remove from the list
 * @param {object} user The user | users
 */
var update_usersList = function (action, user) {

    //decide which action need to be taken
    switch (action) {
        case 'add': //add one user to the list
            addOne(user);
            break;
        case 'add all': //add all users to the list
            addAll(user);
            break;
        case 'remove': //remove the user from the list
            remove(user);
            break;
        default:
            break;
    };

    /**
     * Add the user to the online users list
     * @param {object} user The user
     */
    function addOne(user) {
        $users__list.append(template_userlistItem(user.id, user.name));
    };

    /**
     * Add all users to the online users list
     * @param {object} users All users
     */
    function addAll(users) {

        $users__list.empty();

        $.each(users, function (id, name) {
            $users__list.append(template_userlistItem(id, name));
        });
    };

    /**
     * Remove the user from the online users list
     * @param {object} user The user
     */
    function remove(user) {

        $users__list.find("[data-userId='" + user.id + "']").remove();
    };
};

/**
 * Update the offline users list
 * @param {object} offlineUsers The object that contains all users and the data about them
 */
var update_offlineUsersList = function (offlineUsers) {

    $offline__list.empty();

    $.each(offlineUsers, function (usersGroup, users) {

        for (var i = 0; i < users.length; i++) {
            $offline__list.append(template_userlistItem(null, users[i], usersGroup));
        };
    });
};

/**
 * Update chat widget messages history
 * @param {object} history All messages from history
 */
var update_history = function (history) {

    var startHistory;

    if (history.length > 20) {
        startHistory = history.length - 20;
    } else {
        startHistory = 0;
    };

    for (var i = startHistory; i < history.length; i++) {

        $chat__allMessages.append(template_message(history[i]));
    };
};


/**
 * Get the command from the user inputed message
 * @param {string} msg Comand to execute
 */
var get_cmd = function (msg) {

    var reg = /^!admin\s(.*)/;
    var cmd = msg.match(reg);

    return cmd[1];
};

/**
 * Execute the chat command by sending it to the server to handle it
 * @param {string} cmd
 */
var exec_cmd = function (cmd) {

    socket.emit('command', {
        //'permLevel': role,
        'cmd': cmd
    });
};

/**
 * Get the chat widget command and execute it
 * @param {string} cmd Command
 */
var handle_cmd = function (msg) {

    var cmd = get_cmd(msg);

    exec_cmd(cmd);

    return false;
};

/**
 * Clears the chat widget input
 */
var clear_input = function () {
    //auto focus on input
    $chat__userInput.val('').focus();
};

/**
 * User login
 * @param {object} e The event handler
 */
var doLogin = function (e) {

    var user = $login__userInput.val();
    var pass = $login__passInput.val();

    //check if user is allowed and send login info to server
    user && pass && do_login(user, pass);

    e.preventDefault();
    return false;
};

/**
 * New user register
 * @param {object} e The event handler
 */
var doRegister = function (e) {

    var user = $login__userInput.val();
    var pass = $login__passInput.val();

    //check if user is allowed and send login info to server
    user && pass && do_register(user, pass);

    e.preventDefault();
    return false;
};

/**
 * Chat messages handling
 * @param {object} e The event handler
 */
var doSubmit = function (e) {

    //keep focus on input
    $chat__userInput.focus();
    //user input
    var msg = $chat__userInput.val();
    //test for commands
    var testCmd = /^!admin\s(.*)/;
    //test for, and replace, code injections
    msg = msg.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    //hold the test result true/false
    var inputCmd;
    //handle early exit in case user or message is undefined
    if (!msg || !usr) return false;
    //test for comands in chat
    inputCmd = testCmd.test(msg);
    //if comands are requested
    if (inputCmd) {
        //get command
        handle_cmd(msg);
        clear_input();
        return false;
    };

    //delete cookie and log out, just for testing purpose
    if (msg === "logout") {
        do_logout();
    };

    //title case sentence
    msg = capitalizeSentence(msg);

    //send the message to the server
    socket.emit('user message', {
        'usr': usr,
        'msg': msg
    });

    clear_input();

    e.preventDefault();
    return false;
};


/**
 * Get user for @mention, when user name is clicked
 */
var getUserForMention = function () {

    var user = $(this).text();

    $chat__userInput.val(function (index, msg) {
        $(this).focus();
        return msg + " @" + user + " ";
    });
};

/**
 * Automatically capitalize first letter of each sentence of the provided string.
 * Sentences are splitted by ".", so every dot will mark a new sentence.
 * @param {string} str Any string that need first letter capitalized 
 */
var capitalizeSentence = function (str) {

    var splited = str.split(".");
    var newStr;

    for (var i = 0; i < splited.length; i++) {

        if (/^[a-z]|^\s+[a-z]/.test(splited[i])) {
            var l = splited[i].match(/[a-z]/)[0];
            splited[i] = splited[i].replace(l, l.toUpperCase());
        }
    };

    newStr = splited.join(". ");

    return newStr;
};

/**
 * Reads the uploaded file and sends it to the server
 * @param {object} e The event handler
 */
var getInputedFile = function (e) {

    var reader;

    var file = e.target.files[0];

    if (file) {

        var name = file.name;
        var size = file.size;
        var type = file.type;
        var lastModifiedDate = file.lastModifiedDate;
        var data;

        reader = new FileReader();

        reader.onload = function (evnt) {

            data = evnt.target.result;

            socket.emit('file send', {
                name: name,
                size: size,
                type: type,
                lastModifDate: lastModifiedDate,
                data: data
            });
        }

        reader.readAsDataURL(file);
    };
};


/**
 *          Widgets visual manipulations
 */


/**
 * Displays the chat widget
 * @param {object} e The event handler
 */
var toogleChatDisplay = function (e) {

    $chat.fadeToggle(200);
    $chat__userInput.focus();
    update_scroll();
};

/**
 * Displays the users list
 * @param {object} e The event handler
 */
var displayUserslist = function (e) {

    $users.animate({
        right: "+=400px"
    }, 200, function () {
        $document.off('click.hideUsersList').on('click.hideUsersList', hideUsersList);
    });

    $(this).unbind(e);
};

/**
 * Displays the offline users list
 * @param {object} e The event handler
 */
var displayOfflineUserslist = function (e) {

    $offline__users.animate({
        right: "+=400px"
    }, 200, function () {
        $document.off('click.hideOfflineUsersList').on('click.hideOfflineUsersList', hideOfflineUsersList);
    });

    $(this).unbind(e);
};

/**
 * Displays the streaming options list
 * @param {object} e The event handler
 */
var displayStreamingOptions = function (e) {

    $streaming.animate({
        right: "+=400px"
    }, 200, function () {
        $document.off('click.hideStreamingList').on('click.hideStreamingList', hideStreamingList);
    });

    $(this).unbind(e);
};

/**
 * Triggers the file upload functionality
 */
var fileUploadTrigger = function () {

    $file__input.trigger('click');
};

/**
 * Displays the games list
 * @param {object} e The event handler
 */
var displayGamesList = function (e) {

    $playground__gamesList.animate({
        right: "+=400px"
    }, 200, function () {
        $document.off('click.hideGamesList').on('click.hideGamesList', hideGamesList);
    });

    $(this).unbind(e);
};

/**
 * Displays the random quotes widget
 */
var displayQuotes = function () {

    $quoteGenerator.fadeIn(200, function () {
        $document.off('click.hideQuote').on('click.hideQuotes', hideQuotes);
    });
};

/**
 * Displays the weather widget
 */
var displayWeather = function () {

    $weather.fadeIn(200, function () {
        $document.off('click.hideWeatherInfo').on('click.hideWeatherInfo', hideWeatherInfo);
    });
};

/**
 * Hide online users list
 * @param {object} e The event handler
 */
var hideUsersList = function (e) {

    if (e.target.id == "chat__users" || $(e.target).closest('#chat__users').length) return;

    $users.animate({
        right: "-=400px"
    }, 200, function () {
        $tools__toggleUsers.off('click.displayUserslist').one('click.displayUserslist', displayUserslist);
    });

    $(this).unbind(e);
};

/**
 * Hide offline users list
 * @param {object} e The event handler
 */
var hideOfflineUsersList = function (e) {

    if (e.target.id == "offline__users" || $(e.target).closest('#offline__users').length) return;

    $offline__users.animate({
        right: "-=400px"
    }, 200, function () {
        $tools__toggleOfflineUsers.off('click.displayOfflineUserslist').one('click.displayOfflineUserslist', displayOfflineUserslist);
    });

    $(this).unbind(e);
};

/**
 * Hide the streaming options list
 * @param {object} e The event handler
 */
var hideStreamingList = function (e) {

    if (e.target.id == "streaming" || $(e.target).closest('#streaming').length) return;

    $streaming.animate({
        right: "-=400px"
    }, 200, function () {
        $tools__streaming.off('click.displayStreamingOptions').one('click.displayStreamingOptions', displayStreamingOptions);
    });

    $(this).unbind(e);
};

/**
 * Hide the games list
 * @param {object} e The event handler
 */
var hideGamesList = function (e) {

    if (e.target.id == "playground__gamesList") return;

    $playground__gamesList.animate({
        right: "-=400px"
    }, 200, function () {
        $tools__games.off('click.displayGamesList').one('click.displayGamesList', displayGamesList);
    });

    $(this).unbind(e);
};

/**
 * Hide the random quotes widget
 * @param {object} e The event handler
 */
var hideQuotes = function (e) {

    if (e.target.id == "guoteGenerator" || $(e.target).closest('#guoteGenerator').length) return;

    $quoteGenerator.fadeOut();
    $(this).unbind(e);
};

/**
 * Hide the weather widget
 * @param {object} e The event handler
 */
var hideWeatherInfo = function (e) {

    if (e.target.id == "weather" || $(e.target).closest('#weather').length) return;

    $weather.fadeOut();
    $(this).unbind(e);
};

/**
 * Checks if the application window is focused
 */
var visibilityChanged = function () {

    document.visibilityState === "visible" ? windowFocused = true : windowFocused = false;
};

/**
 * Triggers the form submission and sends the message, when user clicks the arrow icon
 */
var triggerMessageSend = function () {

    $chat__form.submit();
};

/**
 * Close current widget window
 */
var closeWindow = function () {

    $(this).parent().fadeOut();
    $(document).off('click');
};

/**
 *      Catching server events
 */

/**
 * Handle new connections
 */
var onConnection = function () {
    //we need potato connection here
};

/**
 * Handle disconnections
 */
var onDisconnect = function () {};

/**
 * Handle successful logins
 * @param {object} users All users object
 */
var loginSuccess = function (users) {

    var onlineUsers = users.all;
    var offlineUsers = users.offline;
    var history = users.history;
    var thisUser = users.thisUser.user;
    var thisPass = users.thisUser.pass;

    update_usersList('add all', onlineUsers);
    update_offlineUsersList(offlineUsers);
    update_history(history);

    set_cookie('vitUser', thisUser);
    set_cookie('vitPass', thisPass);
    //set_cookie('vitPermissionLevel', thisUserRole);

    usr = thisUser || null;
    //role = thisUserRole || "user";

    //DOM update
    $login.remove();
    $tools.show();
    notify("Welcome " + thisUser + "!");
    update_scroll();
};

/**
 * Handle register successes
 * @param {object} user The user object
 */
var registerSuccess = function (user) {

    var username = user.user;
    var password = user.pass;

    do_login(username, password);
};

/**
 * Handle login fails
 * @param {object} err The error object
 */
var loginFailed = function (err) {

    $login.show();
    $login__submit.fadeOut(function () {
        $register__submit.fadeIn();
    });

    $login__userInput.focus();
    $login__error.text(err.message);
};

/**
 * Remove disconnected users from the users list
 * @param {object} user The user info object
 */
var aClientDisconnected = function (user) {

    update_usersList('remove', user);
};

/**
 * Update the users list with the new joined user
 * @param {object} user The user info object
 */
var newUserLogin = function (user) {

    update_usersList('add', user);
    notify(user.name + " joined!");
};

/**
 * Display new messages from all users
 * @param {object} o The message object
 */
var newMessage = function (o) {
    //number of messages displayed in chat
    var msgCount = $chat__allMessages[0].childElementCount;
    //remove oldest message when message count exceeds the limit
    if (msgCount >= 50) {
        $chat__allMessages[0].removeChild($chat__allMessages[0].childNodes[0]);
    }
    //display the new message to users
    $chat__allMessages.append(template_message(o));
    //user notification if application window is out of focus
    !windowFocused && notify(o.usr + ' : ' + o.msg);
    //scroll chat messages to bottom
    update_scroll();
};

/**
 * This is for testing purpose, appending the app logo in chat if user says "!admin logo"
 * @param {object} imgInfo Image data
 */
var imageTest = function (imgInfo) {

    var img = new Image();

    img.onload = function () {
        $chat__allMessages.append(img);
        update_scroll();
    };

    img.src = 'data:image/jpeg;base64,' + imgInfo.buffer;
};

/**
 * Decide the type of the tranferred file, then append it into chat widget
 * @param {object} file The file data and informations
 */
var fileBroadcastAll = function (file) {

    var fileType = file.content.type;
    var image = /^image\//;
    var txt = /^text\//;

    //decide the file MIME type and act accordingly
    if (image.test(fileType)) {

        $chat__allMessages.append(template_imageTransfer(file.user, file.content));

    } else if (txt.test(fileType)) {

        $chat__allMessages.append(template_txtTransfer(file.user, file.content));
    }
    //after file append, scroll down
    update_scroll();
};


/**
 *      IO listeners
 */
socket.on('connection', onConnection);
socket.on('disconnect', onDisconnect);
socket.on('login success', loginSuccess);
socket.on('register success', registerSuccess);
socket.on('login failed', loginFailed);
socket.on('client disconnected', aClientDisconnected);
socket.on('new user login', newUserLogin);
socket.on('new message', newMessage);
socket.on("image", imageTest);
socket.on("file broadcast all", fileBroadcastAll);

/**
 *      Event listeners
 */
//          --/TOOLS/--         //
$tools__toogleChat.off('click.toogleChatDisplay').on('click.toogleChatDisplay', toogleChatDisplay);
$tools__toggleUsers.off('click.displayUserslist').one('click.displayUserslist', displayUserslist);
$tools__toggleOfflineUsers.one('click.displayOfflineUserslist', displayOfflineUserslist);
$tools__fileSend.off('click.fileUploadTrigger').on('click.fileUploadTrigger', fileUploadTrigger);
$tools__streaming.off('click.displayStreamingOptions').on('click.displayStreamingOptions', displayStreamingOptions);
$tools__games.off('click.displayGamesList').on('click.displayGamesList', displayGamesList);
$tools__quotes.off('click.displayQuotes').on('click.displayQuotes', displayQuotes);
$tools__weather.off('click.displayWeather').on('click.displayWeather', displayWeather);
$tools__signOut.off('click.do_logout').on('click.do_logout', do_logout);

//          --/DOCUMENT/--         //
if (document.addEventListener) document.addEventListener("visibilitychange", visibilityChanged);

//          --/OTHER/--         //
$register__submit.on('click.doRegister', doRegister);
$login__submit.on('click.doLogin', doLogin);
$chat__form.submit(doSubmit);
$file__input.on('change.getInputedFile', getInputedFile);
$chat__submitPlaceholder.on('click.triggerMessageSend', triggerMessageSend);
$chat.on('click.msgUser', '.chat__messageUser', getUserForMention);
$users__list.on('click.msgUser', 'li', getUserForMention);
$closeWindow.on('click.closeWindow', closeWindow);