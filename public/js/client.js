/**
 *      Global Constants
 */
const url = window.location.href;
const socket = io.connect(url);


/**
 *      Cookies management
 */
//
var get_cookieByName = function (name) {

    var p1 = "(?:(?:^|.*;\\s*)";
    var p2 = "\\s*\\=\\s*([^;]*).*$)|^.*$";
    var regex = new RegExp(p1 + name + p2);

    return document.cookie.replace(regex, "$1");
};
//
var get_all = function () {

    return document.cookie;
};
//
var reset_cookie = function (name) {

    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
};
//
var set_cookie = function (name, val) {

    if (name && val) document.cookie = name + "=" + val;
};


/**
 *      Login handler
 */



/**
 *      Caching selectors
 */
var $chat = $('#chat'),
    $chat__allMessages = $('#chat__allMessages'),
    $chat__form = $('#chat__form'),
    $chat__userInput = $('#chat__userInput'),
    $chat__submit = $('#chat__submit');


var $login = $('#login'),
    $login__form = $('#login__form'),
    $login__userInput = $('#login__userInput'),
    $login__submit = $('#login__submit');

var $users__list = $('#users__list');

/**
 *      Global Variables
 */
var usr = get_cookieByName('user') || null; //local saved user name
if (!usr) {
    $login.show();
    $login__userInput.focus();
} else {
    $chat.show();
}


/**
 *      Templates
 */
var template_message = function (u, m) {

    l = '<li>' + u + ': ' + m + '</li>';

    return l;
};

var template_userlistItem = function (id, u) {

    l = '<li data-userId=' + id + '>' + u + '</li>';

    return l;
};

var do_login = function (socket, user) {

    socket.emit('user login', user);
}

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

    function add(user) {
        $users__list.append(template_userlistItem(user.id, user.name));
    };

    function addAll(users) {

        $.each(users, function (id, name) {
            template_userlistItem(id, name)
        });
    }

    function remove(user) {

    };

};

/**
 *      Managing form submits
 */
$login__form.submit(function (e) {

    var user = $login__userInput.val();
    set_cookie('user', user);
    usr = user || usr;
    //send login info to server
    do_login(socket, user);
    //DOM update
    $login.remove();
    $chat.show();
    $chat__userInput.focus();

    e.preventDefault();
    return false;
});


//
$chat__form.submit(function (e) {

    var msg = $chat__userInput.val();

    if (msg === "reset") {
        reset_cookie("user");
        location.reload();
    }

    //handle early exit in case user or message is undefined
    if (!msg || !usr) return false;

    socket.emit('user message', {
        'usr': usr,
        'msg': msg
    });

    $chat__userInput.val('').focus();

    e.preventDefault();
    return false;
});


/**
 *      Catching server events
 */
socket.on('connection', function () {
    //we need potato connection here
});

socket.on('new message', function (o) {

    $chat__allMessages.append(template_message(o.usr, o.msg));
});

socket.on('new user logged in', function (user) {

    update_usersList('add', user);
});

socket.on('fetch users', function (allUsers) {

    update_usersList('add all', allUsers);
});