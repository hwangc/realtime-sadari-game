Template.roomUsers.helpers({
  players: function() {
    var userInfo = this.userInfo;
    var allUsers = userInfo.fetch();
    var players  = _.where(allUsers, {gameReady: true});

    return players;
  },
  observers: function() {
    var userInfo  = this.userInfo;
    var allUsers  = userInfo.fetch();
    var observers = _.where(allUsers, {gameReady: false});

    return observers;
  },
  gameStage: function(stage) {
    if(Template.instance().data.roomInfo.fetch()[0].gameStage === stage) {
      return true;
    }

    return false;
  },
  isCreator: function() {
    var thisPlayer = this;
    if(thisPlayer._id === Template.instance().data.roomInfo.fetch()[0].creatorID) {
      return true;
    }

    return false;
  }
});

Template.roomUsers.onRendered(function() {
  // accordion
  $('.play.guest').accordion();
  $('.online.guest').accordion();
})
