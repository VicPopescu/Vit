/**
 *      Profanity Filter Module
 */
var ProfanityFilter = (function () {

    /**
     *      Dependencies
     */
    var fs = require('fs');


    /**
     *      Global variables
     */
    var dictionary_location = __dirname + '/bad_words_dictionary/dictionary.JSON';

    /**
     *      Return entire dictionary
     */
    var getDictionaryJSON = function () {

        function fsCallback(err, dictionary) {

            //check for config reading errors
            if (err) {
                return console.log("Read dictionary file error: ", err);
            }

            return dictionary;
        }

        return JSON.parse(fs.readFileSync(dictionary_location, 'utf8', fsCallback));
    }


    /**
     *      Read dictionary file and return regex with bad words
     */
    var badWords = function () {

        return new RegExp(getDictionaryJSON().badWords.join("|"), 'i');
    }


    /**
     *      Read dictionary file and return replacement words
     */
    var goodWord = function () {

        var arr = getDictionaryJSON().fluffyWords;

        return arr[Math.floor(Math.random() * arr.length)];
    }

    /**
     *      Add new bad words to dictionary
     */
    var addBadWord = function (newBadWord) {

        fs.readFile(dictionary_location, 'utf8', function (err, dictionary) {

            if (err) return console.log(err);

            //parse external JSON into object that can be modified
            var parsedDictionary = JSON.parse(dictionary);

            //add bad word if it's not already added
            if (parsedDictionary.badWords.indexOf(newBadWord) == -1) {

                parsedDictionary.badWords.push(newBadWord);

                //stringify object so it can be writted on external JSON file
                parsedDictionary = JSON.stringify(parsedDictionary);

                fs.writeFile(dictionary_location, parsedDictionary, 'utf8', function (err) {

                    if (err) return console.log(err);
                    console.log("Successful writed!")
                });
            } else {
                console.log("That bad word already exists!");
            }
        });
    }

    /**
     *      Replace bad words with fluffy unicorns
     */

    var filterReplace = function (message) {

        var w = message.split(" ");
        var bad = badWords();

        for (var i = 0; i < w.length; i++) {

            if (bad.test(w[i])) {
                
                var good = goodWord();
                w[i] = good;
            }
        }

        w = w.join(' ');

        return w;
    }

    /**
     *      Public exports
     */
    var PUBLIC_METHODS = {

        getDictionary: getDictionaryJSON,

        getBadWords: badWords,

        getGoodWord: goodWord,

        addBadWord: addBadWord,

        filterReplace: filterReplace
    };

    return PUBLIC_METHODS;

})();

module.exports = ProfanityFilter;