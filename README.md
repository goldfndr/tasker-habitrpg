tasker-habitrpg
===============

A base for interacting with [HabitRPG's](https://habitrpg.com/) [API](https://habitrpg.com/static/api) via [Tasker](http://tasker.dinglisch.net/)

Installation
------------

1. Download the files, edit **HabitRPGfns.js** to match your [API values](https://habitrpg.com/#/options/settings/api) (note the API Token as password warning!) and [CDS](http://habitrpg.wikia.com/wiki/Settings#Custom_Day_Start). Note that you'll need to uncomment them (remove the ```//``` at the beginning of the three ```setGlobal``` lines).

2. Create a directory named ```JavaScript``` in your **/sdcard/Tasker** directory.
(You'll probably find other directories here, like ```log``` and ```userguide```.)

3. Copy the edited **HabitRPGfns.js** file to your newly created **/sdcard/Tasker/JavaScript** directory.
If you hadn't edited it yet, you could paste the values in from the [mobile app](https://play.google.com/store/apps/details?id=com.ocdevel.habitrpg). After you have it working, you can recomment or delete those lines. New versions of HabitRPGfns.js will have them commented out.

4. Optionally import the example tasks. Within Tasker, press the Tasks tab twice (or long-press it) to get to Import. The files will need to end with ".tsk.xml" to be visible.

For a couple of the example tasks (score a task, check done), you'll need to change the Variable Set ```%taskid``` action to use one of your own values.
One method to find your task's ID is the following.
  1. Log into HabitRPG from Chrome or Firefox.
  2. Open the Developer Tools (press F12 or Ctrl+Shift+I).
  3. Choose the Network tab.
  4. Sync.
  5. Select the "batch-update" request.
  6. In the Preview (Chrome) or Response (Firefox) subtab, expand ```dailys``` or ```habits``` or ```todos``` or ```rewards``` (whatever you're looking for).
  7. For Chrome, find the text you seek, expand the task's entry. For Firefox, expand objects until you find the text you seek.
  8. The "id" has the value you'll use for the Variable Set ```%taskid``` action.

The HabitRPGfns.js is commented with each operation's inputs; use ```%result``` (string) or ```%results``` (array) as appropriate.

If you plan to do any automated profiles, you might want to at least do a Test Net action (Type=Connection Type) and stop if the value is ```none```.

### Example 1
Create a profile that, within a Time context, runs once a day (From equals To), with a task of *get streaks*. No more wondering what the heck your streaks were after you accidentally didn't login for a couple of days!

### Example 2
Create a profile that, within a Time context, runs periodically in the day (repeats), with a cloned task of *check done*. A persistent reminder to do that daily!

### Example 3
If there's a daily you often forget to perform or check off, you can easily create a widget with a tap shortcut of a clone of *score a task*, and a profile with time context that periodically does a cloned *check done* with actions to change the widget's appearance depending on task completed (rather than notify). This functionality is included with Tasker, but you can use Zooper Widget or Minimalistic Text or other plugins for customization.

### Planned features
* function: get_due (data similar to the [User Data Display](https://oldgods.net/habitrpg/habitrpg_user_data_display.html)'s Dailies Incomplete "task" column)
* task: check due (a persistent notification that calls get_due) -- see what and how many dailies you haven't yet done!
* function: strip emoji short-names (short codes)
* function: replace emoji short-names with Android emoji ([Kit Kat/4.4](http://emojipedia.org/google-emoji-list/) or newer preferred)
* task: prune the streaks-all log to a limited count

Credits
-------
* [LadyAlys: Android's Tasker app and HabitRPG's API](http://habitrpg.wikia.com/wiki/User_blog:LadyAlys/Android%27s_Tasker_app_and_HabitRPG%27s_API)
* [Diary of a geek](http://blog.andrew.net.au/2014/08/05#nfc_habitrpg) (some reverse engineering from screenshots)
* https://github.com/Alys/tools-for-habitrpg, especially the [User Data Display](https://oldgods.net/habitrpg/habitrpg_user_data_display.html)
