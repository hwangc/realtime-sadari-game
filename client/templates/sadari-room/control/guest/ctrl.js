Template.guestCtrl.onCreated(function() {

});

Template.guestCtrl.helpers({
  gameStage: function(stage) {
    if(this.roomInfo.fetch()[0].gameStage === stage) {
      return true;
    }

    return false;
  },
  isReady: function() {
    if(Meteor.userId() && Meteor.user().gameReady) {
      return true;
    }

    return false;
  }
});

Template.guestCtrl.onRendered(function() {

  var template = this;

  // set the enter key event for gameStage submit
  $(document).keypress(function(e) {
      var $submitBtn = template.$('.sadari-game-ready .button');
      if(e.which == 13 && ($submitBtn.attr('disabled') !== 'disabled')) {
        e.preventDefault();
        $submitBtn.trigger('click');
      }
  });
});

Template.guestCtrl.events({
  'click .sadari-game-ready .button': function(event, template) {

    event.preventDefault();

    var $submitBtn = template.$(event.currentTarget);
    // prevent double click
    $submitBtn.attr('disabled','disabled');
    // trigger event
    var autoReadyGame = $.Event('autoReadyGame');
    $('.sadari-room').trigger(autoReadyGame);
  }
});

Template.guestCtrl.onDestroyed(function() {
});
