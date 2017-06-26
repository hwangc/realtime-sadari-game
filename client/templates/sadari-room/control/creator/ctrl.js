Template.creatorCtrl.onCreated(function() {

});

Template.creatorCtrl.helpers({
  gameStage: function(stage) {
    if(this.roomInfo.fetch()[0].gameStage === stage) {
      if(!Meteor.user().gameReady && !(stage === 'init' || stage === 'started' || stage === 'end') ) {
        var autoReadyGame = $.Event('autoReadyGame');
        // assign a sit for the creator first
        $('.sadari-room').trigger(autoReadyGame);
      }
      return true;
    }

    return false;
  },
  isReady: function() {
    if(Meteor.users.findOne({_id: this.roomInfo.fetch()[0].creatorID}).gameReady) {
      return true;
    }

    return false;
  }
});

Template.creatorCtrl.onRendered(function() {

  var template = this;

  // set the enter key event for gameStage submit
  $(document).keyup(function(e) {
    var $submitBtn = template.$('.control-footer .button');

    if(e.which == 13 && ($submitBtn.attr('disabled') !== 'disabled')) {
      e.preventDefault();
      // move the focus to the button after input type
      template.$('button').focus();
      $submitBtn.trigger('click');
    }
  });
});

Template.creatorCtrl.events({
  'click .prize-share .button': function(event, template) {

    event.preventDefault();

    var $submitBtn = template.$(event.currentTarget);
    // prevent double click
    $submitBtn.attr('disabled','disabled');

    var noPrize   = true;
    var roomInfo  = template.data.roomInfo.fetch()[0];
    var roomID    = template.data.roomInfo.fetch()[0]._id;
    var ladderSet = roomInfo.ladderSet;

    // get all the prize input value
    $('.player .sadari-prize input').each(function(colID){

      // set the prize in the ladderSet
      ladderSet[colID].prizeName = $(this).val();

      // check if any prize updated
      if($(this).val() && noPrize) {
        noPrize = false;
      }
    });

    // no prize entered
    if(noPrize) {
      $submitBtn.siblings('.error.message').show();
      return;
    }

    // loading on the prize share button
    $submitBtn.addClass('loading');

    // set the prizes
    Meteor.call("sadariRoomUpdate", {roomID: roomID, set: {ladderSet: ladderSet}}, function(error, result){
      if(error){
      }
      if(result){
        $submitBtn
        .removeClass('loading')
        .text('완료')
        .attr('disabled',true)
        .hide()
        .siblings('.label')
        .removeClass('red pointing below')
        .addClass('green right pointing')
        .text('모든 사람에게 공유 되었습니다.')
        .hide('fast',function() {
          var autoReadyGame = $.Event('autoReadyGame');
          // assign a sit for the creator first
          $('.sadari-room').trigger(autoReadyGame);
        });
      }
    });
  },
  'click .sadari-game-ready .button': function(event, template) {
    // trigger event
    // var autoReadyGame = $.Event('autoReadyGame');
    // var roomInfo = template.data.roomInfo.fetch()[0];
    // var roomID   = roomInfo._id;
    //
    // $('.sadari-room').trigger(autoReadyGame);
    // Meteor.call('sadariRoomUpdate', {roomID: roomID, set: {gameStage:'start'}});
  },
  'click .sadari-game-start .button': function(event, template) {

    event.preventDefault();

    var $submitBtn = $(event.currentTarget);
    // prevent double click
    $submitBtn.attr('disabled','disabled');

    var roomInfo = template.data.roomInfo.fetch()[0];
    var roomID = roomInfo._id;

    Meteor.call('sadariRoomUpdate', {roomID: roomID, set: {isOpen: false, gameStart: true, gameStage:'started'}},
      function(error, result) {
        if(error){
        }
        if(result){
          // when a game gets started, it will hide the dimmer and start the game.
          // go to sadari-room.js autorun
        }
    });
  }
});

Template.creatorCtrl.onDestroyed(function() {
});
