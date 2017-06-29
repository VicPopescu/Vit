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


        var activityId;

        /**
         * 
         */
        var displayChallenge = function (challengeDetails) {

            var oppName = challengeDetails.challenger.name;
            var oppId = challengeDetails.challenger.id;
            var actName = challengeDetails.activityId;

            if (confirm(oppName + " challenged you to: " + actName)) {

                socket.emit("activity accepted", oppId);

                $playground__selectOpponent.hide();
                $playground__activitySpace.fadeIn();
                $playground__activityStatus.html("You are playing " + actName + " with " + oppName);
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
            //var activityName = get_activityNameById(activityId);

            $tools__toggleUsers.trigger('click');
            $users__list.on('click.getOpponent', 'li', function (e1) {

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
         * 
         */
        var startActivity = function () {

            $playground__activityStatus.html("Activity accepted!!!");
            //start activity here
        };

        /**
         * Display the playground and Initialize the selected game
         */
        var initGameSpace = function () {

            activityId = $(this).data('activityid');

            $playground__activitySpace.fadeIn();
            $playground__selectOpponent.one('click.selectOpponent', selectOpponent);
            $playground__selectOpponent.show();
        };

        $playground__gameTrigger.on('click.initGameSpace', initGameSpace);

        socket.on('activity challenge', displayChallenge);
        socket.on('activity accepted', startActivity);
        socket.on('activity declined', declinedActivity);

    })();
});