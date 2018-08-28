document.addEventListener("DOMContentLoaded", function () {
	// okay the fucking css columns are making this a bit difficult
	// so we just show the first picture and then make all the others the same size
	// and then check if they are visible
	var first = document.querySelector("img.first");
	var the_rest = updateRest(document);

	function updateRest (document) {
		return document.querySelectorAll("img.hidden:not(.first)");
	}

	imagesLoaded(first, function () {
		var h = first.height;
		var w = first.width;

		
		for (var i = the_rest.length - 1; i >= 0; i--) {
			the_rest[i].setAttribute("height", h);
			the_rest[i].setAttribute("width", w);
		}

		// wait for next draw
		window.requestAnimationFrame(function () {
			scrollTop = window.scrollY + window.innerHeight;

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
			the_rest = updateRest(document);
		});
	});
});