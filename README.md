tasker-habitrpg
===============

A base for interacting with [HabitRPG's](https://habitrpg.com/) [API](https://habitrpg.com/static/api) via [Tasker](http://tasker.dinglisch.net/)

Installation
------------

1. Create a directory named ```JavaScript``` in your **/sdcard/Tasker** directory.
(You'll probably find other directories here, like ```log``` and ```userguide```.)

2. Copy the **HabitRPGfns.js** file from here to your newly created **/sdcard/Tasker/JavaScript** directory.
It would behoove you to uncomment the first lines and set them to match
your [API values](https://habitrpg.com/#/options/settings/api) (note the API Token as password warning!).
If you want to edit after copying, you could paste the values in from the [mobile app](https://play.google.com/store/apps/details?id=com.ocdevel.habitrpg). After you have it working, you can recomment or delete those lines.

3. Optionally import some of the example tasks.

For some of the example tasks, you'll need to change the Variable Set ```%taskid``` action to use one of your own values.
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

Credits
-------
* [LadyAlys: Android's Tasker app and HabitRPG's API](http://habitrpg.wikia.com/wiki/User_blog:LadyAlys/Android%27s_Tasker_app_and_HabitRPG%27s_API)
* [Diary of a geek](http://blog.andrew.net.au/2014/08/05#nfc_habitrpg) (some reverse engineering from screenshots)
* https://github.com/Alys/tools-for-habitrpg, especially the [User Data Display](https://oldgods.net/habitrpg/habitrpg_user_data_display.html)
