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


/**
 *      Managing form submits
 */
$login__form.submit(function (e) {

    var user = $login__userInput.val();
    set_cookie('user', user);
    usr = user || usr;

    $login.hide();
    $chat.show();
    $chat__userInput.focus();

    e.preventDefault();
    return false;
});


//
$chat__form.submit(function (e) {

    var msg = $chat__userInput.val();
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