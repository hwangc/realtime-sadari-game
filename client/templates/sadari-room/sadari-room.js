Template.sadariRoom.onCreated(function() {

  var template  = this;
  var roomInfo  = this.data.roomInfo.fetch()[0];
  var userInfo  = this.data.userInfo;
  var roomID    = roomInfo._id;
  var ladderSet = roomInfo.ladderSet;
  var restSitID = roomInfo.playersSitID;

  // if(Meteor.userId() && !UserStatus.isMonitoring()) {
  //   userStatusMonitorStart(10000, 2000, false); //30min idle, 2sec interval
  // }
  //
  // save the board functions in the context
  template.board = new Board();

  // when the start button clicked, set the auto start game
  template.autoStartGame = $.Event('autoStartGame');

  template.autorun(function(c) {
    // when logout other clients, return ;
    if(!Meteor.userId()) {
      c.stop();
      return;
    }

    var roomInfo = Template.currentData().roomInfo.fetch()[0];

    if (roomInfo.gameStage === 'started') {
      // for the auto start game
      $('.sadari-room').trigger(template.autoStartGame);
      // the trigger should be stopped after 'started'.
      // if not play will be running more than one time
      c.stop();
    }
    //
    // // let idle users leave rooms
    // if(UserStatus.isIdle()) {
    //   c.stop();
    //   userStatusMonitorStop();
    //   Session.set('roomLeave', true);
    //   // $('.button.sadari-init-pull').trigger('click');
    //   Router.go('sadari.Main');
    // }
  });

  if(Meteor.userId()) {
    // add room id to the user document to remember entered users
    Meteor.call('sadariAddRoomToUser', roomID, Meteor.user().gameReady, function(error, result) {
      if (error) {
      }
      if (result) {
      }
    });
  }
});

Template.sadariRoom.helpers({
  footerTemplate: function() {
    var roomInfo = this.roomInfo.fetch()[0];
    var userInfo = this.userInfo;

    // check creator or guest
    if(Meteor.userId() === roomInfo.creatorID) {
      return 'creatorCtrl';
    }

    // check if sit is available
    if(roomInfo.playersSitID.length === 0 && !Meteor.user().gameReady) {
      return 'observerCtrl';
    }

    return 'guestCtrl';
  }
});

Template.sadariRoom.events({
  'autoReadyGame': function(event, template) {

    event.preventDefault();

    var roomInfo = template.data.roomInfo.fetch()[0];
    var roomID   = roomInfo._id;

    // call the method and call other methods in side of it
    Meteor.call('sadariRoomReadyUpdate', {roomID: roomID}, function(error, result) {
      if(error) {
      }
      if(result) {
        // transit the stage to start
        Meteor.call('sadariRoomUpdate', {roomID: roomID, set: {gameStage:'start'}});
      }
    });

  },
  'autoStartGame': function(event, template) {
    var board             = template.board;
    var roomInfo          = template.data.roomInfo.fetch()[0];
    var roomID            = roomInfo._id;
    var playersNum        = roomInfo.playersNum;
    var ladderNodesCoord  = roomInfo.ladderNodesCoord;
    var ladderSet         = roomInfo.ladderSet;
    var ladderContainerEl = '#ladderContainer';
    var ladderDrawEl      = '#ladderDraw'
    var resultContainerEl = '#resultContainer';
    var resultDrawEl      = '#resultDraw';
    var playResults       = [];
    var ladderResults     = [];
    var routeResults      = [];

    // set loading result
    $('.segment.control').addClass('loading');

    board.setResultContainerArea(resultContainerEl, ladderContainerEl);
    board.setResultDrawArea(resultDrawEl, ladderDrawEl);

    // reset player lines
    board.emptyPlayerLines(resultDrawEl);

    for (var playerID = 0; playerID < playersNum; playerID++) {
      // calculate the result for each player
      playResults[playerID] = board.playLadderGame(playerID, ladderSet, ladderNodesCoord, ladderDrawEl);
    }

    // separate the two results
    ladderResults = _.pluck(playResults, 'result');
    routeResults  = _.pluck(playResults, 'route');

    // show the ladder bridges when the game has been started
    board.drawLadderSideLines(playersNum, ladderNodesCoord, ladderDrawEl);
    board.drawLadderNodesBridges(playersNum, ladderNodesCoord, ladderDrawEl, ladderContainerEl);

    // draw the results lines, true means animation
    board.drawLadderResult(playersNum, routeResults, resultDrawEl, roomID, true);

    // store the ladder results to show on result template
    Meteor.call('sadariRoomUpdate', {roomID: roomID, set: {results: ladderResults, ladderSet: ladderSet}},
      function(error, result) {
        if(error) {
        }
        if(result) {
        }
    });
  },
  'click .sadari-burger-menu': function(event, template) {
    event.preventDefault();
  }
});

Template.sadariRoom.onDestroyed(function() {

  // when logoutOtherClients, return;
  if(!Meteor.userId()) {
    return;
  }

  var userInfo = this.data.userInfo;
  var roomInfo = this.data.roomInfo.fetch()[0];
  var roomID   = roomInfo._id;
  // remove left user from ladderSet
  var ladderSet = roomInfo.ladderSet;
  // and restore the sit for the next player
  var restSitID = roomInfo.playersSitID;

  if(!(roomInfo.gameStage === 'started' || roomInfo.gameStage === 'end' )) {
    // remove the left user
    if(Meteor.user().gameReady) {
      ladderSet[Meteor.user().sitNum - 1].playerName = '대기중';
      restSitID.push(Meteor.user().sitNum - 1);
      Meteor.call('sadariRoomUpdate',{roomID: roomID, set: {playersSitID:restSitID, ladderSet: ladderSet}});
    }
    // when the creator leaves the room
    if(Meteor.userId() === roomInfo.creatorID && userInfo.count() > 1) {
      var nextUser = Meteor.users.findOne({_id:{$ne:roomInfo.creatorID}});
      var isNextUserReady = nextUser.gameReady;
      var roomSet = {};

      if(isNextUserReady) {
        roomSet = { creatorID: nextUser._id };
      } else if(roomInfo.gameStage === 'init' && !isNextUserReady) {
        roomSet = { creatorID: nextUser._id, gameStage: 'init' };
      } else if(!isNextUserReady) {
        roomSet = { creatorID: nextUser._id, gameStage: 'ready' };
      }

      Meteor.call( 'sadariRoomUpdate',{ roomID: roomID, set: roomSet });
    }
  }

  // restore the sit id
  Meteor.call('sadariUserUpdate',{set: {roomID: '', enterTime: null, sitNum: null, gameReady: false, /*inChatRoom: false*/ }});

});

Template.sadariRoom.onRendered(function() {
  var instance = this;

  instance.$('.sadari-room').transition({
    animation: 'pulse',
    duration  : 500
  });
});
