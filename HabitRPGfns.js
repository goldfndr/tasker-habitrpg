// // Only need to be set once; they are Global variables, and survive reboots
// setGlobal('HabitrpgUserid', '########-####-####-####-############');
// setGlobal('HabitrpgApiToken', '########-####-####-####-############');
// setGlobal('HabitrpgCDS', '0');  // Custom Day Start value

const baseurl = 'https://habitrpg.com:443/api/v2/';
var result = "";
var results = [];

// NOTE: %priority is reserved by Tasker. Use %difficulty instead.
// For %boolsfalse, use "down" or "m t w th" or alike; unmentioned are true.
//   Leave unset to have up, down =true.
// Input: text, tasktype (default "todo"), notes (""), id, value (0),
//        difficulty (1), attribute ("str"), boolsfalse
// Result: response (JSON of task)
function add_task() {
	var jsonstring ='"text":"' + text + '", "type":"' + (tasktype || 'todo') + '"';
	if(typeof notes      !== 'undefined') { jsonstring += ', "notes": "' +     notes + '"'; }
	if(typeof difficulty !== 'undefined') { jsonstring += ', "priority": ' +   difficulty; }
	if(typeof attribute  !== 'undefined') { jsonstring += ', "attribute": "' + attribute + '"'; }
	if(typeof id         !== 'undefined') { jsonstring += ', "id": "' +        id + '"'; }
	if(typeof value      !== 'undefined') { jsonstring += ', "value": "' +     notes + '"'; }

	if(typeof boolsfalse      !== 'undefined') {
		if (tasktype == 'habit') {
			jsonstring += ', "' + (boolsfalse + ' ').split(" ").join('": false, "').slice(0, -3);
		} else if (tasktype == 'daily') {
		// NOTE: sending an object with a few false or true is incomplete
		// See also https://github.com/HabitRPG/habitrpg/issues/2334#issuecomment-66168155
			jsonstring += ', "repeat": { ';
			'su m t w th f s'.split(' ').map(function(item) {
				jsonstring += '"' + item + '": '
					+ (boolsfalse.split(" ").indexOf(item) == -1)
					+ (item != 's' ? ', ' : '');
			});
			jsonstring += ' }';
		}
	}
	var http = new XMLHttpRequest();
	http.open("POST", baseurl + 'user/tasks', false);
	setHeaders(http);
	http.send('{ ' + jsonstring + ' }');
	result = http.responseText;
}


// Input: taskid, direction (default "up")
// Result: delta (arbitrarily chosen)
//http://blog.andrew.net.au/2014/08/05
function score_task() {
	var direction = direction || "up";

	var http = new XMLHttpRequest();
	http.open("POST",baseurl + 'user/tasks/' + taskid + '/' + direction, false);
	setHeaders(http);
	http.send();
	var p = JSON.parse(http.responseText);

	result = p.delta;  // We could alternatively return one of gp/exp/mp/hp
}

// Input: taskid
// Results: completed, text, notes, value, priority, streak
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
// Result: string (with linefeeds)
// Results: array of streak@title
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

// Input: (none)
// Results: string (with linefeeds) and array of non-gray dailys undone
// Note: use results(#) for count
function get_due() {
	var today = new Date();
	// It would be cumbersome to get the entire user object just for this
	// so expect that if one uses custom day start, it's stored in Tasker.
	var cds = global('HabitrpgCDS') || 0;

	// credit: Alys's habitrpg_user_data_display.html collateDailiesData()
	today.setHours(today.getHours() - cds);
	today = ["su","m","t","w","th","f","s"][today.getDay()];

	var p = get_all_tasks();
	for(var key in p) {
		var obj = p[key];
		if (obj.type != 'daily' || obj.completed)   {
			continue;
		}
		if(obj.repeat[today]) {
			result += obj.text + "\n";
			results.push(obj.text);
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
		case "get_due" : get_due(); break;
		//default: flash('"' + operation + '" is not implemented in HabitRPGfns.js'); break;
	}
} catch(e) {
	var error = e.message;
}
