/**
 * @author Victor Popescu {@link https://github.com/VicPopescu}
 * @description Handle users activities (games etc)
 */


$(function () {

    var activitiesWidget = (function () {

        var $playground__gameTrigger = $('.playground__gameTrigger');
        var $playground__activitySpace = $('#playground__activitySpace');
        var $playground__selectOpponent = $('#playground__selectOpponent');
        var $playground__activityStatus = $('#playground__activityStatus');
        var $tools__toggleUsers = $('#tools__toggleUsers');
        var $users__list = $('#users__list');
        var $chat__userInput = $('#chat__userInput');
        var $playground__activityView = $('#playground__activityView');


        var activityId;

        /**
         * 
         * @param {*} actId 
         */
        var get_activityNameById = function (actId) {

            switch (actId) {

                case 1:
                    return "Tic-Tac-Toe";

                case 2:
                    return "Example Activity"

                default:
                    break;
            };
        };

        /**
         * 
         * @param {*} challengeDetails 
         */
        var buildPartialView = function (challengeDetails) {

            socket.emit('get activity partial view', challengeDetails);
        };

        /**
         * 
         * @param {*} challengeDetails 
         */
        var playXO = function (challengeDetails) {
            //alert("Not available yet...");
            buildPartialView(challengeDetails);
        };

        /**
         * 
         * @param {*} challengeDetails 
         */
        var playPotato = function (challengeDetails) {

            alert("This is just an example game...");
        };

        /**
         * 
         * @param {*} challengeDetails 
         */
        var activityStart = function (challengeDetails) {

            var actId = challengeDetails.activity.id;

            //initActivityHeaders(challengeDetails);            

            switch (actId) {

                case 1:
                    playXO(challengeDetails);
                    break;

                case 2:
                    playPotato(challengeDetails);
                    break;

                default:
                    break;
            };
        };

        /**
         * 
         */
        var displayChallenge = function (challengeDetails) {

            var player1_name = challengeDetails.player1.name;
            var player1_id = challengeDetails.player1.id;
            var actName = challengeDetails.activity.name;
            var actId = challengeDetails.activity.id;

            if (confirm(player1_name + " challenged you to: " + actName)) {

                socket.emit("activity accepted", challengeDetails);

                $playground__selectOpponent.hide();
                $playground__activitySpace.fadeIn();
                $playground__activityStatus.html("You are playing " + actName + " with " + player1_name);

                activityStart(challengeDetails);

            } else {

                socket.emit("activity declined", player1_id);
            };
        };

        /**
         * 
         */
        var beforeGameStart = function (opponentId, opponentName, activityId) {

            var player2 = {
                id: opponentId,
                name: opponentName
            };

            var activity = {
                id: activityId,
                name: get_activityNameById(activityId)
            }

            var activityDetails = {
                player2: player2,
                activity: activity
            };

            socket.emit('activity challenge', activityDetails);
        };

        /**
         * 
         */
        var selectOpponent = function () {

            var player2_id;
            var player2_name;

            $tools__toggleUsers.trigger('click');

            $users__list.off('click.getOpponent').on('click.getOpponent', 'li', function (e1) {

                $playground__selectOpponent.hide();

                player2_id = $(this).data('userid');
                player2_name = $(this).text();

                $chat__userInput.val('');
                $tools__toggleUsers.trigger('click');
                $playground__activityStatus.html("You challenged " + player2_name + "! Waiting for opponent...");

                beforeGameStart(player2_id, player2_name, activityId);

                $(this).unbind(e1);
            });
        };

        /**
         * 
         */
        var declinedActivity = function () {

            $playground__activityStatus.html("Activity declined...");

            $playground__selectOpponent.one('click.selectOpponent', selectOpponent);
            $playground__selectOpponent.show();
        };

        /**
         * @param {*} view 
         */
        var receiveActivityPartialView = function (activity) {

            var challengeDetails = activity.challengeDetails;
            var view = activity.partialView;

            $playground__activityView.html(view);
            socket.emit('activity ready', challengeDetails);
        };

        /**
         * 
         */
        var startActivity = function (challengeDetails) {

            var player1_Name = challengeDetails.player1.name;
            var player1_Id = challengeDetails.player1.id;
            var player2_Name = challengeDetails.player2.name;
            var player2_Id = challengeDetails.player2.id;
            var actName = challengeDetails.activity.name;
            var actId = challengeDetails.activity.id;

            $playground__activityStatus.html("Activity accepted!!!");

            activityStart(challengeDetails);
        };

        /**
         * Display the playground and Initialize the selected game
         */
        var initGameSpace = function () {

            activityId = $(this).data('activityid');

            $playground__activityView.html('');
            $playground__activityStatus.html('');

            $playground__activitySpace.fadeIn();
            $playground__selectOpponent.show();

            $playground__selectOpponent.off('click.selectOpponent').one('click.selectOpponent', selectOpponent);
        };

        $playground__gameTrigger.on('click.initGameSpace', initGameSpace);

        socket.on('activity challenge', displayChallenge);
        socket.on('activity accepted', startActivity);
        socket.on('activity declined', declinedActivity);
        socket.on('receive activity partial view', receiveActivityPartialView);

    })();
});