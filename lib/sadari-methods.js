var WAITING_MSG = '대기중';

Meteor.methods({
  sadariRoomCreate: function(formValue, isOpen, creatorID) {
    var roomName     = formValue.roomname;
    var roomDesc     = formValue.roomdesc;
    var playersNum   = parseInt(formValue.players);
    var ladderSet    = new Array(playersNum);
    var playersSitID = _.range(playersNum);
    var isLock       = (isOpen) ? 'un' : '';
    var password     = (isOpen) ? null : formValue.password;

    for(var colID = 0; colID < playersNum; colID++) {
      ladderSet[colID] = {
        playerID     : colID,
        playerName   : WAITING_MSG,
        prizeName    : ''
      }
    }

    var roomID       = SadariRooms.insert({
      "title"          : roomName,
      "description"    : roomDesc,
      "playersNum"     : playersNum,
      "ladderSet"      : ladderSet,
      "playersSitID"   : playersSitID,
      "isOpen"         : isOpen,
      "isLock"         : isLock,
      "password"       : password,
      "isGameFinished" : false,
      "gameStage"      : 'init',
      "usersIn"        : [],
      "creatorID"      : creatorID,
      "creatorName"    : '',
      "createdAt"      : new Date()
    });

    return roomID;
  },
  sadariRoomUpdate: function(updateRoom) {
    SadariRooms.update(
      updateRoom.roomID,
      {$set: updateRoom.set }
    );

    return ' room updated';
  },
  sadariRoomReadyUpdate: function(updateRoom) {

    var roomID       = updateRoom.roomID;
    var roomInfo     = SadariRooms.findOne({_id: roomID});
    var ladderSet    = roomInfo.ladderSet;
    // get the playersSitID array plyaersSitID is a range array
    var curRestSitID = roomInfo.playersSitID;
    // pick the random sit id from the restSitID array
    var pickSitID    = curRestSitID[Math.floor(Math.random()*curRestSitID.length)];
    // remove the picked sit id from the restSitID array
    var newRestSitID = _.without(curRestSitID, pickSitID);

    if(curRestSitID.length) {
      if(ladderSet[pickSitID].playerName === WAITING_MSG) {
        // set the random sit for the user
        // get a random number from the total sits
        ladderSet[pickSitID].playerName = Meteor.user().username;
        ladderSet[pickSitID].playerID   = pickSitID;

        // sync call of the method to block other users call
        var result = Meteor.call('sadariRoomUpdate', {roomID: roomID, set:{playersSitID: newRestSitID, ladderSet: ladderSet}});
        var result = Meteor.call('sadariUserUpdate', {set: {gameReady:true, sitNum: (pickSitID+1)}});

        return 'done';
      }

      return 'retry';
    }

    return 'nosit';
  },
  sadariRoomEmptyRemove: function(roomID) {
    if(this.userId) {
      SadariRooms.remove(	roomID );
    }
    return 'sadariRoomEmptyRemove';
  },
  sadariRoomRemove: function(roomID, creatorID) {
    if( this.userId === creatorID ) {
      SadariRooms.remove(	roomID );

      return 'sadariRoomRemove';
    }
  },
  sadariUserUpdate: function(updateUser) {
    Meteor.users.update(
      this.userId,
      {$set: updateUser.set }
    );
    // inChatRoom, gameReady, sitNum, enterTime, roomID
    return ' user info updated';
  },
  sadariAddRoomToUser: function(roomID, isReady) {

    Meteor.users.update(
      this.userId,
      {$set:{'roomID': roomID, 'enterTime': Date.now(), 'gameReady': (isReady) ? true : false }}
    );

    return ' room id added to user';
  },
  sadariChats: function(roomID, author, text) {
    check([roomID, author, text], [String]);
    SadariChats.insert({
      roomID: roomID,
      author: author,
      text: text,
      createdAt: new Date()
    });

    return ' room chat added';
  }
});

if(Meteor.isServer){
  Meteor.methods({
    sendEmail: function (from, text) {
      check([from, text], [String]);

      // Let other method calls from the same client start running,
      // without waiting for the email sending to complete.
      this.unblock();

      //actual email sending method
      Email.send({
        to: 'hwangc@hwangc.com',
        from: from,
        subject: 'New message from Sadari Club',
        text: text
      });
    }
  });
}
