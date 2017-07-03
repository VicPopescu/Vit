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
         * @param {*} challengeDetails 
         */
        var buildPartialView = function (challengeDetails) {

            socket.emit('get activity partial view', challengeDetails.activityId);
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

            var actId = challengeDetails.activityId;

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

            var oppName = challengeDetails.challenger.name;
            var oppId = challengeDetails.challenger.id;
            var actName = challengeDetails.activityId;
            var actId = challengeDetails.activityId;

            if (confirm(oppName + " challenged you to: " + actName)) {

                socket.emit("activity accepted", challengeDetails);

                $playground__selectOpponent.hide();
                $playground__activitySpace.fadeIn();
                $playground__activityStatus.html("You are playing " + actName + " with " + oppName);

                activityStart(challengeDetails);

            } else {

                socket.emit("activity declined", oppId);
            };
        };

        /**
         * 
         */
        var beforeGameStart = function (opponentId, opponentName, activityId) {

            var opponentDetails = {
                id: opponentId,
                name: opponentName
            };

            var activityDetails = {
                opponent: opponentDetails,
                activityId: activityId
            };

            socket.emit('activity challenge', activityDetails);
        };

        /**
         * 
         */
        var selectOpponent = function () {

            var opponentId;
            var opponentName;

            $tools__toggleUsers.trigger('click');

            $users__list.off('click.getOpponent').on('click.getOpponent', 'li', function (e1) {

                $playground__selectOpponent.hide();

                opponentId = $(this).data('userid');
                opponentName = $(this).text();

                $chat__userInput.val('');
                $tools__toggleUsers.trigger('click');
                $playground__activityStatus.html("You challenged " + opponentName + "! Waiting for opponent...");

                beforeGameStart(opponentId, opponentName, activityId);

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
        var receiveActivityPartialView = function (view) {

            $playground__activityView.html(view);
        };

        /**
         * 
         */
        var startActivity = function (challengeDetails) {

            var oppName = challengeDetails.challenger.name;
            var oppId = challengeDetails.challenger.id;
            var actName = challengeDetails.activityId;
            var actId = challengeDetails.activityId;

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