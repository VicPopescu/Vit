/**
 *      Global Constants
 */
const url = window.location.protocol + '//' + window.location.host;
var opt = {
    path: '/socket.io',
    //transports: ['websocket'],
    //upgrade: false
};

// const opt = {
//     transports: ['websocket'],
//     upgrade: false
// }
const socket = io.connect(url, opt);

/**
 *      Caching selectors
 */

var $document = $(document);

var $chat = $('#chat'),
    $chat__allMessages = $('#chat__allMessages'),
    $chat__form = $('#chat__form'),
    $chat__userInput = $('#chat__userInput'),
    $chat__submit = $('#chat__submit');

var $file = $('#file'),
    $file__input = $('#file__input'),
    $file__submit = $('#file__submit');

var $chat_messageUser = $('.chat__messageUser');

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

var $tools = $('#tools'),
    $tools__toggleUsers = $('#tools__toggleUsers'),
    $tools__toggleOfflineUsers = $('#tools__toggleOfflineUsers'),
    $tools__fileSend = $('#tools__fileSend'),
    $tools__streaming = $('#tools__streaming'),
    $tools__games = $('#tools__games'),
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
 * @param {string} u 
 * @param {string} m 
 */
var template_message = function (u, m) {

    var t = '<li><span class="chat__messageUser">' + u + '</span>:<span class="chat__message"> ' + m + '</span></li>';

    return t;
};

/**
 * 
 * @param {number} id 
 * @param {string} u 
 */
var template_userlistItem = function (id, u, role) {

    var id = id || "N/A";
    var role = role || "user";
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

    d = $('<a download="' + content.name + '" href=' + content.data + ' title="' + content.name + '">' + content.name + '</a>').append(img);
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

    d = $('<a class="fileTransfer__text" download="' + content.name + '" href=' + content.data + ' title="' + content.name + '">' + content.name + '</a>').append(file);
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
}



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
function updateScroll() {

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
        var user = history[i].usr;
        var message = history[i].msg;

        $chat__allMessages.append(template_message(user, message));
    };
};


/**
 * 
 * @param {string} str Comand to execute
 */
function get_cmd(str) {

    var reg = /^!cmd\s(.*)/;
    var cmd = str.match(reg);

    return cmd[1];
};

/**
 * 
 * @param {string} cmd 
 */
function exec_cmd(cmd) {

    socket.emit('command', {
        'cmd': cmd
    });
};

/**
 *      Check for commands and return it
 *      @param {string} str User input that need to be checked for commands
 */
var handle_cmd = function (str) {

    var cmd = get_cmd(str);
    exec_cmd(cmd);

    return false;
};

/**
 * 
 */
function clear_input() {
    //auto focus on input
    $chat__userInput.val('').focus();
};



$login__submit.on('click.doLogin', function (e) {

    var user = $login__userInput.val();
    var pass = $login__passInput.val();

    //check if user is allowed and send login info to server
    user && pass && do_login(socket, user, pass);

    e.preventDefault();
    return false;
})

$register__submit.on('click.doRegister', function (e) {

    var user = $login__userInput.val();
    var pass = $login__passInput.val();

    //check if user is allowed and send login info to server
    user && pass && do_register(socket, user, pass);

    e.preventDefault();
    return false;
});
/**
 * Login form
 */
// $login__form.submit(function (e) {

//     var user = $login__userInput.val();
//     var pass = $login__passInput.val();

//     //check if user is allowed and send login info to server
//     user && pass && do_login(socket, user, pass);

//     e.preventDefault();
//     return false;
// });


/**
 * Handle user input
 */
$chat__form.submit(function (e) {

    //user input
    var msg = $chat__userInput.val();

    //handle early exit in case user or message is undefined
    if (!msg || !usr) return false;

    var testReg = /^!cmd\s/;
    var inputCmd = testReg.test(msg);

    //check for user commands
    if (inputCmd) {
        handle_cmd(msg);
        clear_input();
        return false;
    };

    //delete cookie and log out, jsut for testing purpose
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
});


/**
 *      User @mentioning
 */
$chat.on('click.msgUser', '.chat__messageUser', function () {

    var user = $(this).text();

    $chat__userInput.val(function (index, msg) {
        $(this).focus();
        return msg + " @" + user + " ";
    });
});

/**
 * 
 */
$users__list.on('click.msgUser', 'li', function () {

    var user = $(this).text();

    $chat__userInput.val(function (index, msg) {
        $(this).focus();
        return msg + " @" + user + " ";
    });
});

/**
 *
 */
$file__input.on('change', function (e) {

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
});


/**
 * 
 * @param {object} e1 
 */
var displayUserslist = function (e1) {

    $users.animate({
        right: "+=30%"
    }, 200, function () {
        $document.on('click.hideUsersList', hideUsersList);
    });
    $(this).unbind(e1);
};

/**
 * 
 * @param {*} e 
 */
var displayOfflineUserslist = function (e) {

    $offline__users.animate({
        right: "+=30%"
    }, 200, function () {
        $document.on('click.hideOfflineUsersList', hideOfflineUsersList);
    });

    $(this).unbind(e);
};

/**
 * 
 * @param {object} e
 */
function hideUsersList(e) {

    if (e.target.id == "chat__users")
        return;
    //For descendants of menu_content being clicked
    if ($(e.target).closest('#chat__users').length)
        return;

    $users.animate({
        right: "-=30%"
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
        right: "-=30%"
    }, 200, function () {
        $tools__toggleOfflineUsers.off('click.displayOfflineUsers').one('click.displayOfflineUsers', displayOfflineUserslist);
    });
    $(this).unbind(e);
};


/**
 * 
 */
function fileUploadTrigger() {

    $file__input.trigger('click');
};


/**
 * 
 */
var displayStreamingOptions = function () {

    alert("Sorry... Streaming channels are not available yet...");
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
var displayWeather = function () {

    $weather.fadeIn(500, function(){
         $document.one('click.hideWeather', hideWeatherInfo);
    });
};

/**
 * 
 * @param {*} e 
 */
var hideWeatherInfo = function (e) {

    if (e.target.id == "weather__info")
        return;
    //For descendants of menu_content being clicked
    if ($(e.target).closest('#weather__info').length)
        return;

    $weather.fadeOut();
};

/**
 * 
 */
function visibilityChanged() {

    document.visibilityState === "visible" ? windowFocused = true : windowFocused = false;
};


/**
 *      Attach handlers
 */
$tools__toggleUsers.one('click.displayUsers', displayUserslist);
$tools__toggleOfflineUsers.one('click.displayOfflineUsers', displayOfflineUserslist);
$tools__fileSend.off('click.fileSend').on('click.fileSend', fileUploadTrigger);
$tools__streaming.off('click.displayStreamingOptions').on('click.displayStreamingOptions', displayStreamingOptions);
$tools__games.off('click.displayGames').on('click.displayGames', displayGames);
$tools__weather.off('click.displayWeather').on('click.displayWeather', displayWeather);
$tools__signOut.off('click.triggerSignOut').on('click.triggerSignOut', do_logout);
if (document.addEventListener) document.addEventListener("visibilitychange", visibilityChanged);


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

    usr = thisUser || null;

    //DOM update
    $login.remove();
    $tools.show();
    $chat.show();
    $chat__userInput.focus();
    notify("Welcome " + thisUser + "!");
    updateScroll();
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

    $chat__allMessages.append(template_message(o.usr, o.msg));
    !windowFocused && notify(o.usr + ' : ' + o.msg);
    updateScroll();
});

socket.on("image", function (imgInfo) {

    var img = new Image();

    img.onload = function () {
        $chat__allMessages.append(img);
    };

    img.src = 'data:image/jpeg;base64,' + imgInfo.buffer;
});


//
socket.on("file broadcast all", function (file) {

    var fileType = file.content.type;
    var image = /^image\//;
    var txt = /^text\//;


    if (image.test(fileType)) {

        $chat__allMessages.append(template_imageTransfer(file.user, file.content));

    } else if (txt.test(fileType)) {

        $chat__allMessages.append(template_txtTransfer(file.user, file.content));
    }
});