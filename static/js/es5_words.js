"use strict";

var BEGINNING = "-B-";
var END = "-E-";

var buzzing = function buzzing(words) {
  return getWord(words, BEGINNING, randomInt(15, 75), []).reverse().reduce(function (acc, el) {
    if (el === "-E-") return acc;
    if (el == "," || el == ".") return acc + el;
    return acc + " " + el;
  });
};

var buzzing_title = function buzzing_title(words) {
  // change the two values in randomInt to set min and max length of title
  return getWord(words, BEGINNING, randomInt(2, 4), []).reverse().reduce(function (acc, el) {
    if (el === "-E-") return acc;
    if (el == "," || el == ".") return acc + el;
    return acc + " " + el;
  });
};

var getWord = function getWord(words, word, count, targetList) {
  var nextWords = words[word];

  var _word = function (nextWords) {
    // return random word if nextwords is none
    // or small random chance
    if (!nextWords || nextWords.length === 0 || randomInt(0, 10) < 2) {
      var keys = Object.keys(words);
      return keys[randomInt(0, keys.length)];
    }

    return nextWords[randomInt(0, nextWords.length)];
  }(nextWords);

  if (count === 0) {
    // we reached zero before END
    targetList.push(_word);
    return targetList;
  }

  if (_word === END) {
    // we reached end
    return targetList;
  }

  targetList = getWord(words, _word, count - 1, targetList);
  targetList.push(_word);
  return targetList;
};

var randomInt = function randomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
};

var app = function app() {
  "use strict"; // elements

  var buzzwords = document.getElementById('buzzword');
  var title = document.getElementById('buzztitle'); //const like = document.getElementById('like');

  var next = document.getElementById('next'); //console.log(like);
  //console.log(next);

  Promise.all([fetch(window.dataUrl).then(function (response) {
    return response.text();
  }), fetch(window.titleUrl).then(function (response) {
    return response.text();
  })]).then(function (things) {
    var bound_words = buzzing.bind(null, JSON.parse(things[0]));
    var t = JSON.parse(things[1]);
    var bound_titles = buzzing_title.bind(null, t);

    var exchange = function exchange(_bound_buzz, _bound_titles, _buzzwords, _buzztitle) {
      _buzzwords.textContent = _bound_buzz();
      _buzztitle.textContent = _bound_titles();
    };

    buzzwords.textContent = bound_words();
    buzztitle.textContent = bound_titles();
    next.addEventListener('click', exchange.bind(null, bound_words, bound_titles, buzzwords, buzztitle));
  });
};

document.addEventListener("DOMContentLoaded", app);
