document.addEventListener("DOMContentLoaded", function () {
	// okay the fucking css columns are making this a bit difficult
	// so we just show the first picture and then make all the others the same size
	// and then check if they are visible
	var first = document.querySelector("img.first");
	var the_rest = updateRest(document);

	function updateRest (document) {
		return document.querySelectorAll("img.hidden:not(.first)");
	}

	function setWAndH () {
		var first = document.querySelector("img.first");
		var h = first.height;
		var w = first.width;

		var targets = document.querySelectorAll("img:not(.first)");
		
		for (var i = targets.length - 1; i >= 0; i--) {
			targets[i].setAttribute("height", h);
			targets[i].setAttribute("width", w);
		}
	}

	function unhideAndUpdateRest (the_rest) {
		var scrollTop = window.scrollY + window.innerHeight;

			for (var i = 0; i <= the_rest.length - 1; i++) {
				if(the_rest[i].offsetTop < scrollTop) {

					// exchange data-src and src
					// add eventhandler
					// set correct class
					var e = the_rest[i];
					(function closure (e) { 
					    imagesLoaded(e, function imageLoaded () {
							e.classList.remove("hidden");
						});
					})(e); 

					e.setAttribute("src", e.dataset.src);
				}
			}

	}

	imagesLoaded(first, function () {
		setWAndH();

		// wait for next draw
		window.requestAnimationFrame(function () {
			unhideAndUpdateRest(the_rest);
			window.addEventListener("scroll", _.throttle(_.partial(unhideAndUpdateRest, the_rest), 250), {passive: true});
			window.addEventListener("resize", _.debounce(setWAndH, 250, {trailing: true, leading: true}), {passive: true});
		});

	});
});