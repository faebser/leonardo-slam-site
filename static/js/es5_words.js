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
  // elements
  var buzzwords = document.getElementById('buzzword'); //const like = document.getElementById('like');

  var next = document.getElementById('next'); //console.log(like);

  console.log(next);
  fetch(window.dataUrl).then(function (response) {
    response.text().then(function (text) {
      var words = JSON.parse(text);
      var bound_buzz = buzzing.bind(null, words);

      var exchange = function exchange(_bound_buzz, _buzzwords) {
        _buzzwords.textContent = bound_buzz();
      };

      buzzwords.textContent = bound_buzz(); // do all the init here

      next.addEventListener('click', exchange.bind(null, bound_buzz, buzzwords));
    });
  });
};

document.addEventListener("DOMContentLoaded", app);
