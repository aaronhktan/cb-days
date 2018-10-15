var daysIncremented = 0;

function HTMLRequest(URL) {
	var request = new XMLHttpRequest();

	request.open("GET", URL, true);
	request.send();

	var resultPromise = new Promise(
		function(resolve, reject) {
			request.onreadystatechange = function() {
				if (this.readyState == XMLHttpRequest.DONE) {
					resolve(request.response);
				}
			};
		})

	return resultPromise;
}

function getDay(addedDays) {
	var start = moment().add(addedDays, 'days').startOf('day').format(), end = moment().add(addedDays, 'days').endOf('day').format();
	var URL = 'https://www.googleapis.com/calendar/v3/calendars/ocdsb.ca_9lc41apmrj6npek85r8fd6fr00@group.calendar.google.com/events?key=AIzaSyAjadW_dG-vMWLeXhb_8YodtQ9r5Y23Hvc' + '&timeMin=' + start + '&timeMax=' + end;

	HTMLRequest(URL).then(function(result) {
  	var data = JSON.stringify(result);
		if (data.search(/day [1-4]/i) >= 0) { // Matches "Day x" format where x is a number from 1 to 4
			console.log(data.substring(data.search(/day [1-4]/i), data.search(/day [1-4]/i) + 5));
			$("#day").html((data.substring(data.search(/day [1-4]/i), data.search(/day [1-4]/i) + 5).toUpperCase()));
			if (Math.round(Math.random()) == 0) {
				$("#day").css('color', '#4CBB17');
			} else {
				$("#day").css('color', '#4169E1');
			}
			if (daysIncremented == 1) {
				$("#sentence").html("TOMORROW WILL BE A");
			} else if (daysIncremented > 1) {
				$("#sentence").html(moment().add(daysIncremented, 'days').format('MMM Do').toUpperCase() + " WILL BE A");
			}
		} else {
			daysIncremented++;
			try {
				if (daysIncremented > 9) {
					throw "Vacation!";
				}
				getDay(daysIncremented);
			} catch (err) {
				$("#day").html("VACAY!")
			}
		}
	})
}

getDay(daysIncremented);