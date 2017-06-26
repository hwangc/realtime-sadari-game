var timeTick = new Tracker.Dependency();
var timeIntv = 10000;

Meteor.setInterval(function () {
	timeTick.changed();
}, timeIntv);

fromNowReactive = function (mmt) {
	timeTick.depend();
	return mmt.fromNow();
}
