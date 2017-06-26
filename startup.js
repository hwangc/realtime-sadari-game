if(Meteor.isClient){

  Meteor.startup(function(){
    Session.setDefault({
      'isOpen': true,
      'roomLeave': false
    });
    return SEO.config({
      auto: {
        twitter: true,
        og: true,
        set: ['description', 'title', 'image']
      },
      title: '실시간 사다리 게임',
      meta: {
        'description': '직장인, 학생, 친구, 남녀노소 누구나 쉽고 재미있게 즐기는 실시간 사다리 게임'
      },
      og: {
        'url'  : 'http://sadari.club',
        'image': 'http://sadari.club/images/sadari.png',
        'type' : 'website'
      },
      twitter: {
        'url'  : 'http://sadari.club'
      }
    });
  });
}
const TEST_ROOM_NUM = 12;
const TEST_USER_NUM = 10;
const TEST = false;

if(Meteor.isServer && TEST){
  Meteor.startup(function(){
    // the total count of users
    var usersCount = Meteor.users.find().count();

    if(usersCount < TEST_USER_NUM) {
      var count = 0;

      do {
        count++;

        var user = Fake.user({
          fields: ['emails.address', 'profile.name']
        });
        user.username = user.profile.name;
        Accounts.createUser(user);

      } while (count < TEST_USER_NUM);
    }

    // the total count of the rooms
    var roomsCount = SadariRooms.find().count();

    if(roomsCount < TEST_ROOM_NUM) {

      SadariRooms.remove({});
      var count = 0;
      var max = 20, min = 2;

      do {
        count++;
        var fakePlayersNum = Math.floor(Math.random() * (max - min + 1)) + min;
        var ladderSet = [];
        var playersSitID = _.range(fakePlayersNum);
        var fakeCreatorID = _.flatten(_.sample(Meteor.users.find().fetch(), 1))[0]._id

        for(var colID=0; colID<fakePlayersNum;colID++) {
          ladderSet[colID] = {
            playerID     : colID,
            playerName   : '대기중',
            prizeName    : Fake.word()
          };
        }

        SadariRooms.insert({
          "title"          : Fake.sentence([5]),
          "description"    : Fake.sentence([10]),
          "playersNum"     : fakePlayersNum,
          "ladderSet"      : ladderSet,
          "playersSitID"   : playersSitID,
          "isOpen"         : true,
          "isLock"         : 'un',
          "password"       : null,
          "isGameFinished" : false,
          "gameStage"      : 'init',
          "usersIn"        : [],
          "creatorID"      : fakeCreatorID,
          "creatorName"    : '',
          "createdAt"      : new Date()
        });

      } while (count < TEST_ROOM_NUM);
    }
  });
}
