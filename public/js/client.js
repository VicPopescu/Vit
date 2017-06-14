/**
 *      Global Constants
 */
const url = window.location.href;
const opt = {
    transports: ['websocket'],
    upgrade: false
}
const socket = io(url, opt);


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
    $login__submit = $('#login__submit');

var $users = $('#chat__users');
var $users__list = $('#users__list');
var $toggle__users = $('#toggleUsers');


/**
 *      Templates
 */
var template_message = function (u, m) {

    l = '<li><span class="chat__messageUser">' + u + '</span>:<span class="chat__message"> ' + m + '</span></li>';

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

        $users__list.empty();

        $.each(users, function (id, name) {
            $users__list.append(template_userlistItem(id, name));
        });
    }

    function remove(user) {

        $users__list.find("[data-userId='" + user.id + "']").remove();
    };

};

/**
 *      Global Variables
 */
var usr = get_cookieByName('user') || null; //local saved user name


/**
 *      Handle commands
 */
function get_cmd(str) {

    var reg = /^!cmd\s(.*)/;
    var cmd = str.match(reg);

    return cmd[1];
};

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

function clear_input() {

    //auto focus on input
    $chat__userInput.val('').focus();
};

/**
 *      Auto login if user already logged
 */
if (!usr) {
    $login.show();
    $login__userInput.focus();
} else {
    do_login(socket, usr);
    $chat.show();
}


/**
 *      Login form
 */
$login__form.submit(function (e) {

    var user = $login__userInput.val();

    //check if user is allowed and send login info to server
    user && do_login(socket, user);

    e.preventDefault();
    return false;
});


/**
 *      Handle user input
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
        reset_cookie("user");
        location.reload();
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

//
$users__list.on('click.msgUser', 'li', function () {

    var user = $(this).text();

    $chat__userInput.val(function (index, msg) {
        $(this).focus();
        return msg + " @" + user + " ";
    });
});

//
$file__input.on('change', function (e) {

    var reader;

    var file = e.target.files[0];

    if (file) {

        reader = new FileReader();

        reader.onload = function (evnt) {

            socket.emit('file transfer', {
                Data: evnt.target.result
            });
        }

        reader.readAsDataURL(file);
    };

});

function displayUserslist(e1) {

    $users.animate({
        right: "+=26%"
    }, 300, function () {
        $document.on('click.hideUsersList', hideUsersList);
    });
    $(this).unbind(e1);
}

function hideUsersList(ev) {

    if (ev.target.id == "chat__users")
        return;
    //For descendants of menu_content being clicked
    if ($(ev.target).closest('#chat__users').length)
        return;

    $users.animate({
        right: "-=26%"
    }, 300, function () {
        $toggle__users.off('click.displayUsers').one('click.displayUsers', displayUserslist);
    });
    $(this).unbind(ev);
};

//
$toggle__users.one('click.displayUsers', displayUserslist);



/**
 *      Catching server events
 */
socket.on('connection', function () {
    //we need potato connection here
    update_usersList('add all', allUsers);
});

socket.on('disconnect', function () {
    //
});


/////////////////////////////////////////////

socket.on('connection success', function (users) {

    var all = users.all;
    var thisUser = users.thisUser;

    update_usersList('add all', all);

    set_cookie('user', thisUser);
    usr = thisUser || usr;

    //DOM update
    $login.remove();
    $chat.show();
    $chat__userInput.focus();
});

socket.on('a client disconnected', function (user) {

    update_usersList('remove', user);
});

socket.on('a user logged in', function (user) {

    update_usersList('add', user);
});


///////////////////////////////////////////////

socket.on('new message', function (o) {

    $chat__allMessages.append(template_message(o.usr, o.msg));
});

socket.on("image", function (imgInfo) {

    var img = new Image();

    img.onload = function () {
        $chat__allMessages.append(img);
    };

    img.src = 'data:image/jpeg;base64,' + imgInfo.buffer;
});


//
socket.on("file transfer all", function (file) {

    var img = new Image();
    img.src = file.Data;

    $(img).css({
        'width': '100%',
        'height': 'auto'
    });

    var imgLink = $("<a download='name' href=" + file.Data + " title=''></a>");
    imgLink.append(img);
    $chat__allMessages.append(imgLink);
});