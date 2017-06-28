/**
 *      Global Constants
 */
const url = window.location.protocol + '//' + window.location.host;
var opt = {
    path: '/socket.io',
    //transports: ['websocket'],
    //upgrade: false
};

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



/**
 * 
 * @param {string} name 
 */
var get_cookieByName = function (name) {

    var p1 = "(?:(?:^|.*;\\s*)";
    var p2 = "\\s*\\=\\s*([^;]*).*$)|^.*$";
    var regex = new RegExp(p1 + name + p2);

    return document.cookie.replace(regex, "$1");
};

/**
 * 
 */
var get_all = function () {

    return document.cookie;
};

/**
 * 
 * @param {string} name 
 */
var reset_cookie = function (name) {

    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
};

/**
 * 
 * @param {string} name 
 * @param {string} val 
 */
var set_cookie = function (name, val) {

    if (name && val) document.cookie = name + "=" + val;
};

/**
 * Login user
 * @param {object} socket 
 * @param {string} user 
 * @param {string} pass 
 */
var do_login = function (socket, user, pass) {

    socket.emit('user login', {
        user: user,
        pass: pass
    });
};

/**
 * Register new user
 * @param {object} socket 
 * @param {string} user 
 * @param {string} pass 
 */
var do_register = function (socket, user, pass) {

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
var pass = get_cookieByName('vitPass') || null; //pass
var windowFocused = true;
var scrollToBottom = true;



/**
 * Auto login if user already logged
 */
if (!usr && !pass) {
    $login.show();
    $login__userInput.focus();
} else {
    do_login(socket, usr, pass);
};

/**
 * 
 * @param {string} format 
 */
var get_date = function (format) {

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
 * 
 * @param {string} u 
 * @param {string} m 
 */
var template_message = function (o) {

    var u = o.usr,
        m = o.msg,
        d = o.date,
        t = o.time;

    if (d === get_date("date")) d = "Today";

    var t = '<li><p class="chat__messageUser">' + u + '</p><span class="chat__messageDate">' + d + ' ' + t + '</span><p class="chat__message"> ' + m + '</p></li>';

    return t;
};

/**
 * 
 * @param {number} id 
 * @param {string} u 
 */
var template_userlistItem = function (id, u, role) {

    var id = id || "N/A";
    //var role = role || "user";
    var u = u || "Anonymous User";

    var t = '<li data-userId=' + id + ' data-userRole=' + role + '>' + u + '</li>';

    return t;
};

/**
 * 
 * @param {string} user 
 * @param {string} content 
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
 * 
 * @param {string} user 
 * @param {string} content 
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
 * 
 * @param {string} notification 
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
 * 
 * @param {string} action 
 * @param {string} user 
 */
var update_usersList = function (action, user) {

    switch (action) {
        case 'add':
            add(user);
            break;
        case 'add all':
            addAll(user);
            break;
        case 'remove':
            remove(user);
            break;
        default:
            break;
    };

    /**
     * 
     * @param {object} user 
     */
    function add(user) {
        $users__list.append(template_userlistItem(user.id, user.name));
    };

    /**
     * 
     * @param {*} users 
     */
    function addAll(users) {

        $users__list.empty();

        $.each(users, function (id, name) {
            $users__list.append(template_userlistItem(id, name));
        });
    };

    /**
     * 
     * @param {object} user 
     */
    function remove(user) {

        $users__list.find("[data-userId='" + user.id + "']").remove();
    };
};

/**
 * 
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
 *
 */
var update_scroll = function () {

    var h = $chat__allMessages.height();
    var s = $chat__allMessages[0].scrollHeight;
    var bot = Math.floor(s - h);

    $chat__allMessages.scrollTop(bot);
};

/**
 * 
 * @param {object} history Messages history
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
 * 
 * @param {string} str Comand to execute
 */
var get_cmd = function (str) {

    var reg = /^!cmd\s(.*)/;
    var cmd = str.match(reg);

    return cmd[1];
};

/**
 * 
 * @param {string} cmd 
 */
var exec_cmd = function (cmd) {

    socket.emit('command', {
        //'permLevel': role,
        'cmd': cmd
    });
};

/**
 *      Check for commands and return it
 *      @param {string} cmd Command
 */
var handle_cmd = function (msg) {

    var cmd = get_cmd(msg);

    exec_cmd(cmd);

    return false;
};

/**
 * 
 */
var clear_input = function () {
    //auto focus on input
    $chat__userInput.val('').focus();
};

/**
 * 
 * @param {*} e 
 */
var doLogin = function (e) {

    var user = $login__userInput.val();
    var pass = $login__passInput.val();

    //check if user is allowed and send login info to server
    user && pass && do_login(socket, user, pass);

    e.preventDefault();
    return false;
};

/**
 * 
 * @param {*} e 
 */
var doRegister = function (e) {

    var user = $login__userInput.val();
    var pass = $login__passInput.val();

    //check if user is allowed and send login info to server
    user && pass && do_register(socket, user, pass);

    e.preventDefault();
    return false;
};

/**
 * 
 * @param {*} e 
 */
var doSubmit = function (e) {

    //keep focus on input
    $chat__userInput.focus();
    //user input
    var msg = $chat__userInput.val();
    //title case sentence
    msg = capitalizeSentence(msg);
    //test for commands
    var testCmd = /^!cmd\s(.*)/;
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
 *      Get user for @mentioning, when user name is clicked
 */
var getUserForMention = function () {

    var user = $(this).text();

    $chat__userInput.val(function (index, msg) {
        $(this).focus();
        return msg + " @" + user + " ";
    });
};

/**
 * Automatically capitalize first letter of the provided sentence or word
 * @param {*} str Any string that need first letter capitalized
 */
var capitalizeSentence = function(str){
    var l = str.charAt(0);
    var str = str.replace(l, l.toUpperCase());

    return str;
};


/**
 * 
 * @param {*} e 
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
 * 
 * @param {*} e 
 */
var toogleChatDisplay = function (e) {

    $chat.fadeToggle(200);
    $chat__userInput.focus();
    update_scroll();
};

/**
 * 
 * @param {object} e 
 */
var displayUserslist = function (e) {

    $users.animate({
        right: "+=400px"
    }, 200, function () {
        $document.on('click.hideUsersList', hideUsersList);
    });

    $(this).unbind(e);
};

/**
 * 
 * @param {*} e 
 */
var displayOfflineUserslist = function (e) {

    $offline__users.animate({
        right: "+=400px"
    }, 200, function () {
        $document.on('click.hideOfflineUsersList', hideOfflineUsersList);
    });

    $(this).unbind(e);
};

/**
 * 
 * @param {*} e 
 */
var displayStreamingOptions = function (e) {

    $streaming.animate({
        right: "+=400px"
    }, 200, function () {
        $document.on('click.hideUsersList', hideStreamingList);
    });

    $(this).unbind(e);
};

/**
 * 
 */
var fileUploadTrigger = function () {

    $file__input.trigger('click');
};

/**
 * 
 */
var displayGames = function () {

    alert("Sorry... Games are not available yet...");
};

/**
 * 
 */
var displayQuotes = function () {

    $quoteGenerator.fadeIn(200, function () {
        $document.on('click.hideQuote', hideQuotes);
    });
};

/**
 * 
 */
var displayWeather = function () {

    $weather.fadeIn(200, function () {
        $document.on('click.hideWeather', hideWeatherInfo);
    });
};

/**
 * 
 * @param {object} e
 */
var hideUsersList = function (e) {

    if (e.target.id == "chat__users")
        return;
    //For descendants of menu_content being clicked
    if ($(e.target).closest('#chat__users').length)
        return;

    $users.animate({
        right: "-=400px"
    }, 200, function () {
        $tools__toggleUsers.off('click.displayUsers').one('click.displayUsers', displayUserslist);
    });

    $(this).unbind(e);
};

/**
 * 
 * @param {*} e 
 */
var hideOfflineUsersList = function (e) {

    if (e.target.id == "offline__users")
        return;
    //For descendants of menu_content being clicked
    if ($(e.target).closest('#offline__users').length)
        return;

    $offline__users.animate({
        right: "-=400px"
    }, 200, function () {
        $tools__toggleOfflineUsers.off('click.displayOfflineUsers').one('click.displayOfflineUsers', displayOfflineUserslist);
    });

    $(this).unbind(e);
};

/**
 * 
 * @param {*} e 
 */
var hideStreamingList = function (e) {

    if (e.target.id == "streaming")
        return;
    //For descendants of menu_content being clicked
    if ($(e.target).closest('#streaming').length)
        return;

    $streaming.animate({
        right: "-=400px"
    }, 200, function () {
        $tools__streaming.off('click.displayOfflineUsers').one('click.displayOfflineUsers', displayStreamingOptions);
    });

    $(this).unbind(e);
};

/**
 * 
 * @param {*} e 
 */
var hideQuotes = function (e) {

    if (e.target.id == "guoteGenerator")
        return;
    //For descendants of menu_content being clicked
    if ($(e.target).closest('#guoteGenerator').length)
        return;

    $quoteGenerator.fadeOut();
    $(this).unbind(e);
};

/**
 * 
 * @param {*} e 
 */
var hideWeatherInfo = function (e) {

    if (e.target.id == "weather")
        return;
    //For descendants of menu_content being clicked
    if ($(e.target).closest('#weather').length)
        return;

    $weather.fadeOut();
    $(this).unbind(e);
};

/**
 * 
 */
var visibilityChanged = function () {

    document.visibilityState === "visible" ? windowFocused = true : windowFocused = false;
};

/**
 *
 */
var triggerMessageSend = function () {

    $chat__form.submit();
};

/**
 *      Catching server events
 */
//
socket.on('connection', function () {
    //we need potato connection here
    //update_usersList('add all', allUsers);
});
//
socket.on('disconnect', function () {});

/////////////////////////////////////////////

socket.on('login success', function (users) {

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
    //$chat.show();
    //$chat__userInput.focus();
    notify("Welcome " + thisUser + "!");
    update_scroll();
});

socket.on('register success', function (user) {

    var username = user.user;
    var password = user.pass;

    do_login(socket, username, password);
});

socket.on('login failed', function (err) {

    $login.show();
    $login__submit.fadeOut(function () {
        $register__submit.fadeIn();
    });

    $login__userInput.focus();
    $login__error.text(err.message);
});

socket.on('a client disconnected', function (user) {

    update_usersList('remove', user);
});

socket.on('a user logged in', function (user) {

    update_usersList('add', user);
    notify(user.name + " joined!");
});


///////////////////////////////////////////////

socket.on('new message', function (o) {
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
});

/**
 * 
 */
socket.on("image", function (imgInfo) {

    var img = new Image();

    img.onload = function () {
        $chat__allMessages.append(img);
        update_scroll();
    };

    img.src = 'data:image/jpeg;base64,' + imgInfo.buffer;
});

/**
 * 
 */
socket.on("file broadcast all", function (file) {

    var fileType = file.content.type;
    var image = /^image\//;
    var txt = /^text\//;


    if (image.test(fileType)) {

        $chat__allMessages.append(template_imageTransfer(file.user, file.content));

    } else if (txt.test(fileType)) {

        $chat__allMessages.append(template_txtTransfer(file.user, file.content));
    }

    update_scroll();
});


/**
 *      Event listeners
 */
//          --/TOOLS/--         //
$tools__toogleChat.off('click.toggleChat').on('click.toggleChat', toogleChatDisplay);
$tools__toggleUsers.one('click.displayUsers', displayUserslist);
$tools__toggleOfflineUsers.one('click.displayOfflineUsers', displayOfflineUserslist);
$tools__fileSend.off('click.fileSend').on('click.fileSend', fileUploadTrigger);
$tools__streaming.off('click.displayStreamingOptions').on('click.displayStreamingOptions', displayStreamingOptions);
$tools__games.off('click.displayGames').on('click.displayGames', displayGames);
$tools__quotes.off('click.displayQuotes').on('click.displayQuotes', displayQuotes);
$tools__weather.off('click.displayWeather').on('click.displayWeather', displayWeather);
$tools__signOut.off('click.triggerSignOut').on('click.triggerSignOut', do_logout);

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