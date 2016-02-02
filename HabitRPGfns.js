// // Only need to be set once; they are Global variables, and survive reboots
// setGlobal('HabitrpgUserid', '########-####-####-####-############');
// setGlobal('HabitrpgApiToken', '########-####-####-####-############');
// setGlobal('HabitrpgCDS', '0');  // Custom Day Start value, 0 if not set

// A constant and two variables used by most of the functions
var BASE_URL = 'https://habitica.com:443/api/v2';
var result = '';
var results = [];


// Many of the functions have input %variables; if a variable is followed by
//   parentheses then it has a default value, else a value must be assigned.
// All will end with %result (string) and/or %results (array) set.


// Input: text, tasktype (default "todo"), notes (""), taskid (random UUID),
//        value (0 [reward=10]), difficulty (1), attribute ("str"), boolsfalse
// NOTE: Use %difficulty instead of %priority; latter is reserved by Tasker.
// %boolsfalse setting examples: "down" or "m t w th"; unmentioned are true.
//   Leave unset to have both up+down =true (habit), all days =true (daily).
// End result: response (JSON of task)
function add_task() {
	var tasktype = tasktype || 'todo';
	var jsonstr ='"text": "' + text + '", "type": "' + tasktype + '"';
	// It would be simpler to avoid typeof but that seems to throw an error in Tasker.
	// There's probably a clever way to do these next few lines with an array.
	if (typeof notes      !== 'undefined')  jsonstr += ', "notes": "' +     notes + '"';
	if (typeof taskid     !== 'undefined')  jsonstr += ', "id": "' +        taskid + '"';
	if (typeof value      !== 'undefined')  jsonstr += ', "value": "' +     value + '"';
	if (typeof difficulty !== 'undefined')  jsonstr += ', "priority": ' +   difficulty;
	if (typeof attribute  !== 'undefined')  jsonstr += ', "attribute": "' + attribute + '"';

	if (typeof boolsfalse !== 'undefined') {
		if (tasktype == 'habit') {
			jsonstr += ', "' + (boolsfalse + ' ').split(" ").join('": false, "').slice(0, -3);
		} else if (tasktype == 'daily') {
		// NOTE: sending an object with a few false or true is incomplete, must provide all
		// See also https://github.com/HabitRPG/habitrpg/issues/2334#issuecomment-66168155
			jsonstr += ', "repeat": { ';
			'su m t w th f s'.split(' ').map(function(item) {
				jsonstr += '"' + item + '": '
					+ (boolsfalse.split(" ").indexOf(item) == -1)
					+ (item != 's' ? ', ' : '');
			});
			jsonstr += ' }';
		}
	}

	result = callAPI('POST', '/user/tasks', '{ ' + jsonstr + ' }');
}

// Input: taskid, direction (default "up")
// End result: delta (arbitrarily chosen)
// End results: lvl, hp, exp, mp, gp (after-value, not difference)
//http://blog.andrew.net.au/2014/08/05
function score_task() {
	var dir = direction || 'up';
	var runnable = true;
	if (dir == 'down') {
		//only for testing
		// don't downscore if it's not a bad habit, check type and down
		var q = JSON.parse(callAPI("GET", '/user/tasks/' + taskid));
		if ((q.type == 'habit' && q.down == false) || q.type == 'daily' || q.type == 'todo') {
			//flash ('Ignoring down score');
			runnable = false;
		} 
	} 
	if (runnable) {
		var p = JSON.parse(callAPI("POST", '/user/tasks/' + taskid + '/' + dir));
		result = p.delta;  // We could alternatively return one of gp/exp/mp/hp
		results = [ p.lvl, p.hp, p.exp, p.mp, p.gp ];
	}
}

// Input: taskid
// End results: completed, text, notes, value, priority, streak
// guessed from http://blog.andrew.net.au/2014/08/05
function query_task() {
	var p = JSON.parse(callAPI('GET', '/user/tasks/' + taskid));
	results = [ p.completed, p.text, p.notes, p.value, p.priority, p.streak ];
}

// Input: tagname
// End result: string (with linefeeds) of id,text,notes
// End results: array of id,text,notes
// Used to build today checklist (and notifications)
function get_tasks_by_tag_name() {
	var today = get_today();
	var p = get_tasks_by_tag_id(get_tag_id_by_name(tagname));
	for (var key in p) {
		if (p[key].type == 'daily' && !(p[key].repeat[today])) {
			continue;
		}
		var txt = p[key].id + ',' + p[key].text + ',' + p[key].notes;
		result += txt + '\n';
		results.push(txt);
	}
}

// Input: (none)
// End result: string (with linefeeds) of streak@title
// End results: array of streak@title
function get_streaks() {
	var p = get_all_tasks();
	for (var key in p) {
		if (p[key].streak) {
			var txt = p[key].streak + '@' + p[key].text;
			result += txt + '\n';
			results.push(txt);
		}
	}
}

// Input: (none)
// End result: string (with linefeeds) of non-gray dailys undone
// End results: array of non-gray dailys undone
// Hint: use %results(#) for count
function get_due() {
	var today = get_today();

	var p = get_all_tasks();
	for (var key in p) {
		var obj = p[key];
		if (obj.type != 'daily' || obj.completed)   {
			continue;
		}
		if (obj.repeat[today]) {
			result += obj.text + '\n';
			results.push(obj.text);
		}
	}
}

// This is a helper function for get_due and get_tasks_by_tag_name
function get_today() {
	var today = new Date();
	// It would be cumbersome to get the entire user object just for this
	// so expect that if one uses custom day start, it's stored in Tasker.
	var cds = global('HabitrpgCDS') || 0;
	// credit: Alys's habitrpg_user_data_display.html collateDailiesData()
	today.setHours(today.getHours() - cds);
	today = ['su','m','t','w','th','f','s'][today.getDay()];
	return today;
}


// This is a helper function for get_streaks and get_due
function get_all_tasks() {
	return JSON.parse(callAPI('GET', '/user/tasks'));
}

function get_tasks_by_tag_id(tagId) {
	return get_all_tasks().filter(function (el) {
		return el.tags[tagId] == true;
	});
}

function get_tag_id_by_name(tagName) {
	return get_all_tags().filter(function (el) {
		return el.name == tagName;
	})[0].id;
}

function get_all_tags() {
	return JSON.parse(callAPI('GET', '/user/tags'));
}

// This is a helper function for all calls
function callAPI(method, partialURL, postData) {
	var http = new XMLHttpRequest();
	http.open(method, BASE_URL + partialURL, false);
	http.setRequestHeader('Content-Type', 'application/json');
	http.setRequestHeader('x-api-user', global('HabitrpgUserid'));
	http.setRequestHeader('x-api-key', global('HabitrpgApiToken'));
	if (typeof postData !== 'undefined')  http.send(postData);
	else                                  http.send();
	return (http.responseText);
}

try {
	switch (operation) {
		case 'add_task': add_task(); break;
		case 'score_task': score_task(); break;
		case 'query_task': query_task(); break;
		case 'get_streaks' : get_streaks(); break;
		case 'get_due' : get_due(); break;
		case 'get_tasks_by_tag': get_tasks_by_tag_name(); break;
		default: flash('HabitRPGfns.js lacks "' + operation + '"');
	}
} catch (e) {
	var error = e.message;
	alert('HabitRPGfns.js error: "' + error + '"');
}
