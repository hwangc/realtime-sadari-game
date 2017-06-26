// don't show the log
TimeSync.loggingEnabled = false

// user status check
userStatusMonitorStart = function(threshold, interval, idleOnBlur) {
  Tracker.autorun(function (c) {
    if(Meteor.userId()) {
      try {
        UserStatus.startMonitor({
          threshold: threshold,
          interval: interval,
          idleOnBlur: idleOnBlur
        });
        c.stop();
      } catch(err) {
        //  console.log(err);
      }
    } else {
      // UserStatus.stopMonitor();
    }
  });
}

// user status check
userStatusMonitorStop = function() {
  Tracker.autorun(function (c) {
    if(Meteor.userId()) {
      UserStatus.stopMonitor();
      c.stop();
    }
  });
}
