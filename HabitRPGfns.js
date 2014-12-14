// Only need to be set once; they are Global variables, and survive reboots
// setGlobal('HabitrpgUserid', '########-####-####-####-############');
// setGlobal('HabitrpgApiToken', '########-####-####-####-############');
// setGlobal('HabitrpgCDS', '0');  // Custom Day Start value

const baseurl = 'https://habitrpg.com:443/api/v2/';
var result = "";
var results = [];

// Input: text, type (default "todo"), notes (default "")
// Results: response
function add_task() {
	type = type ||  "todo";
	notes = notes || "";
	http_post_data = { "text": text, "type": type, "notes": notes };

	var http = new XMLHttpRequest();
	http.open("POST", baseurl + 'user/tasks', false);
	setHeaders(http);
	http.send(http_post_data);
	result = http.responseText;
}


// Input: taskid, direction (default "up")
// Results: completed
//http://blog.andrew.net.au/2014/08/05
function score_task() {
	direction = direction || "up";

	var http = new XMLHttpRequest();
	http.open("POST",baseurl + 'user/tasks/' + taskid + '/' + direction, false);
	setHeaders(http);
	http.send();
	var p = JSON.parse(http.responseText);

	result = p.delta;  // We could alternatively return one of gp/exp/mp/hp
}

// Input: taskid
// Results: completed, text, notes, value, priority
// guessed from http://blog.andrew.net.au/2014/08/05
function query_task() {
	var http = new XMLHttpRequest();
	http.open("GET",baseurl + 'user/tasks/' + taskid, false);
	setHeaders(http);
	http.send();
	var p = JSON.parse(http.responseText);

	results = [ p.completed, p.text, p.notes, p.value, p.priority, p.streak ];
}


// This is a helper function for get_streaks and get_due
function get_all_tasks() {
	var http = new XMLHttpRequest();
	http.open("GET", baseurl + 'user/tasks', false);
	setHeaders(http);
	http.send();
	return JSON.parse(http.responseText);
}

// Input: (none)
// Results: string (with linefeeds) and array of streak@title
function get_streaks() {
	var p = get_all_tasks();
	for(var key in p) {
		if (p[key].streak) {
			var txt = p[key].streak + "@" + p[key].text;
			result += txt + "\n";
			results.push(txt);
		}
	}
}

function setHeaders(http) {
	http.setRequestHeader("Content-Type", "application/json");
	http.setRequestHeader("x-api-user", global('HabitrpgUserid'));
	http.setRequestHeader("x-api-key", global('HabitrpgApiToken'));
}

try {
	switch(operation) {
		case "add_task": add_task(); break;
		case "score_task": score_task(); break;
		case "query_task": query_task(); break;
		case "get_streaks" : get_streaks(); break;
		//default: flash('"' + operation + '" is not implemented in HabitRPGfns.js'); break;
	}
} catch(e) {
	var error = e.message;
}
