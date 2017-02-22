chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);
		// ----------------------------------------------------------
		// This part of the script triggers when page is done loading
		console.log("Loading Details...");
		// ----------------------------------------------------------
		setTimeout(function () {
			console.log("now loading details");
       			LoadDetails();
        	}, 5000);

		console.log("finished readystate.");
	}
	}, 10);
});
