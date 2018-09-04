const BEGINNING = "-B-";
const END = "-E-";

const buzzing = (words) => {
	return getWord(words, BEGINNING, randomInt(10, 15), [])
			.reverse()
			.reduce((acc, el) => {
				if(el === "-E-") return acc;
				if(el == "," || el == ".") return acc + el;
				return acc + " " + el;
			});
}

const getWord = (words, word, count, targetList) => {
	
	const nextWords = words[word];

	const _word = ((nextWords) => {
		// return random word if nextwords is none
		// or small random chance
		if(!nextWords || nextWords.length === 0 || randomInt(0, 10) < 2) {
			const keys = Object.keys(words);
			return keys[randomInt(0, keys.length)];
		}
		return nextWords[randomInt(0, nextWords.length)];
	})(nextWords);

	if (count === 0) { // we reached zero before END
		targetList.push(_word);
		return targetList;
	}

	if (_word === END) { // we reached end
		return targetList;
	}

	targetList = getWord(words, _word, count-1, targetList);
	targetList.push(_word);
	return targetList;
}

const randomInt = (min, max) => {
	min = Math.ceil(min);
  	max = Math.floor(max);
  	return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

const app = () => {

	// elements
	const buzzwords = document.getElementById('buzzword');
	//const like = document.getElementById('like');
	const next = document.getElementById('next');

	//console.log(like);
	console.log(next);
    
    fetch(window.dataUrl)
    	.then((response) => {
    		response.text()
    			.then((text) => {
    				const words = JSON.parse(text);
    				const bound_buzz = buzzing.bind(null, words);
    				const exchange = (_bound_buzz, _buzzwords) => {
    					_buzzwords.textContent = bound_buzz();
    				};
    				buzzwords.textContent = bound_buzz();
    				// do all the init here
    				next.addEventListener('click', exchange.bind(null, bound_buzz, buzzwords));
    			});
	    });
};

document.addEventListener("DOMContentLoaded", app);