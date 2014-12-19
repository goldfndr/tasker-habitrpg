tasker-habitrpg
===============

A base for interacting with [HabitRPG's](https://habitrpg.com/) [API](https://habitrpg.com/static/api) via [Tasker](http://tasker.dinglisch.net/)

Installation
------------

1. After downloading the files, edit **HabitRPGfns.js** to match your [API values](https://habitrpg.com/#/options/settings/api) (note the *API Token like a password* warning!) and [CDS](http://habitrpg.wikia.com/wiki/Settings#Custom_Day_Start). Note that you'll need to uncomment them (remove the ```//``` at the beginning of the three ```setGlobal``` lines).

2. In your **/sdcard/Tasker** directory, create a ```JavaScript``` directory.
(You'll probably find other directories here, like ```log``` and ```userguide```.)

3. Copy the edited **HabitRPGfns.js** file to your newly created **/sdcard/Tasker/JavaScript** directory.
If you hadn't edited it yet, you could paste the values in from the [mobile app](https://play.google.com/store/apps/details?id=com.ocdevel.habitrpg). After you confirm it's operational, you can recomment or delete those lines. New versions of HabitRPGfns.js will have them commented out.

4. Optionally import the example tasks. Copy them somewhere (e.g. /sdcard/Tasker/tasks) then, within Tasker, [Import](http://tasker.dinglisch.net/userguide/en/faqs/faq-how.html#q). The files need to end with ".tsk.xml" to be listed.

For a couple of the example tasks (*score a task*, *check done*), you'll need to change the Variable Set ```%taskid``` action to use one of your own values. I suggest cloning these tasks (long-press name, menu, Clone) to avoid confusion, or you could import again.
An easy method to find a Task's ID is to use the [User Data Display](https://oldgods.net/habitrpg/habitrpg_user_data_display.html)'s Task Overview with "toggle developer data".
A cumbersome alternative method is the following.
  1. Login to HabitRPG from Chrome or Firefox.
  2. Open the Developer Tools (press F12 or Ctrl+Shift+I).
  3. Choose the Network tab.
  4. [Sync](http://habitrpg.wikia.com/wiki/Sync).
  5. Select the "batch-update" request.
  6. In the Preview (Chrome) or Response (Firefox) subtab, expand ```dailys``` or ```habits``` or ```todos``` or ```rewards``` (whatever you're looking for).
  7. For Chrome, find the text you seek, expand the task's entry. For Firefox, expand objects until you find the text you seek.
  8. The "id" has the value you'll use for the Variable Set ```%taskid``` action.

HabitRPGfns.js is commented with each operation's inputs; use ```%result``` (string) or ```%results``` (array) as appropriate for your actions' parameters.

### Example 1
[Create a profile](http://www.pocketables.com/2013/05/beginners-guide-to-tasker-part-1-5-tasker-basics-new-ui.html) that, within a [Time context](http://tasker.dinglisch.net/userguide/en/timecontext.html), runs once a day (From equals To), with a task of *get streaks*. No more wondering what the heck your streaks were after you accidentally didn't login for a couple of days!

### Example 2
Create a profile that, within a Time context, runs periodically in the day (repeats), with a task of *check due* (e.g. every half hour from 11:33 after CDS to 0:33 after CDS).
A [permanent reminder](http://tasker.dinglisch.net/userguide/en/help/ah_notification.html) (with count) of your remaining dailys!
Note that there may be a very limited amount of space to display the list (wider in landscape); [AutoNotification](https://play.google.com/store/apps/details?id=com.joaomgcd.autonotification) is one way to display more.

### Example 3
Create a profile that, within a Time context, runs periodically in the day (repeats), with a [cloned task](http://tasker.dinglisch.net/userguide/en/activity_main.html#tasks) of *check done* (with ```%taskid``` specifically set).
A permanent reminder to do your daily! Optionally [add a location context](http://tasker.dinglisch.net/userguide/en/loccontext.html) if your daily can't be completed everywhere.

### Example 4
If there's a specific daily you often forget to perform or check off, you can easily [create a widget](http://tasker.dinglisch.net/userguide/en/app_widgets.html)
with a tap shortcut of a clone of *score a task*,
and a profile with time context that periodically does a cloned *check done*
with actions to change the widget's [image](http://tasker.dinglisch.net/userguide/en/help/ah_change_widget_icon.html) and/or [label](http://tasker.dinglisch.net/userguide/en/help/ah_change_widget_text.html) depending on task completed (rather than notify).
This functionality is included with Tasker, but you can use Zooper Widget or Minimalistic Text or other plugins for further customization.

### Useful tips
* Strip the [emoji short-names](http://www.emoji-cheat-sheet.com/) from the result.

>  Variable Search Replace [ *Variable:*```%result``` *Search:*```:[\w]+:``` *Multi-Line:*Off *One Match Only:*Off *Store Matches In:* *Replace Matches:*On *Replace With:* ]

* Display the result but only in the Tasker UI (not elsewhere). Handy for testing.

>  Popup [ *Text:*```%result``` ] *If* [ ```%caller1``` ~ ```ui``` ]

* Clear all Tasker-generated notifications. Handy for testing.
(From the [main screen's menu](http://tasker.dinglisch.net/userguide/en/activity_main.html#menus): More, Run An Action.)

> Notify Cancel

* For a periodic (time context with repeat) profile, make sure you can actually reach the HabitRPG server.

> Test Net [ *Type:*Connection Type *Store Result In:*```%contype``` ]<br>
> Stop [ *Task:* ] *If* [ ```%contype``` ~ ```none``` ]

### Planned features
* function: replace [emoji short-names](http://www.emoji-cheat-sheet.com/) with Android emoji ([Kit Kat/4.4](http://emojipedia.org/google-emoji-list/) or newer preferred)
* task: *prune streaks-all* to a limited count
* scene: add a task; [spinners](http://developer.android.com/guide/topics/ui/controls/spinner.html)
* scene: augment above to store while offline, sync when getting online (possibly premium)

Credits
-------
* [LadyAlys: Android's Tasker app and HabitRPG's API](http://habitrpg.wikia.com/wiki/User_blog:LadyAlys/Android%27s_Tasker_app_and_HabitRPG%27s_API)
* [Diary of a geek](http://blog.andrew.net.au/2014/08/05#nfc_habitrpg) (some reverse engineering from screenshots)
* https://github.com/Alys/tools-for-habitrpg, especially the [User Data Display](https://oldgods.net/habitrpg/habitrpg_user_data_display.html)

Apologies
---------
The term "task" is used by both Tasker (one or more actions) and HabitRPG (habit or daily or to-do or reward). I hope the contexts above disambiguate adequately, but please create an issue (or pull request) if something needs fixing.
