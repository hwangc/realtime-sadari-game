const ROOMS_INCREMENT = 6;
const ACTIVE_ROOM_BTN = 'positive';

Template.sadariRooms.onCreated(function() {
	var instance = this;

	instance.loaded     = new ReactiveVar(0);
	instance.limit      = new ReactiveVar(ROOMS_INCREMENT);
	instance.whichRooms = new ReactiveVar("allGames");

	instance.autorun(function () {

    // get the limit
    var limit = instance.limit.get();

		if(Router.current().params.username) {

			var theUser = Router.current().params.username;
			// user room list
			var sadariRoomsSub = instance.subscribe("sadariRoomsOfTheUser_" + instance.whichRooms.get(), theUser, limit);

		} else {
			var sadariRoomsSub = instance.subscribe("sadariRooms_" + instance.whichRooms.get(), limit);
		}

    // subscribe to the posts publication
		var subscriptionReady = instance.subscriptionsReady();

    // if subscription is ready, set limit to newLimit
    if (subscriptionReady) {
      instance.loaded.set(limit);
			$('.whichRooms').children().removeClass('loading');
    }
  });

	instance.rooms = function() {
		return SadariRooms.find({}, {limit: instance.loaded.get(), sort:{createdAt:-1}});
	};
});

Template.sadariRooms.helpers({
	// the posts cursor
  rooms: function () {
		if(Template.instance().rooms().count()) {
			return Template.instance().rooms();
		}
    return false;
  },
  // are there more posts to show?
  hasMoreRooms: function () {
    return Counts.get('roomCounter') > Template.instance().limit.get();
  },
	getRoomByID: function() {
		return this._id;
	},
	getCreatorName: function() {
		return { username: this.creatorName };
	},
	enteredUsers: function() {
		var enteredUsers = _.size(this.usersIn);
		return enteredUsers;
	},
	createdDate: function() {
		return fromNowReactive(moment(this.createdAt));
	},
	gameStatus: function() {
		var playersNum   = this.playersNum;
		var enteredUsers = _.size(this.usersIn);
		var gameStage    = this.gameStage;
		var creatorID    = this.creatorID;
		var gameStatus   = {};

		switch (gameStage) {
			case 'init':
			case 'ready':
				gameStatus.statusMsg   = '게임 준비중';
				gameStatus.statusColor = 'blue';
				gameStatus.statusIcon  = 'circle thin';
				break;
			case 'start':
				gameStatus.statusMsg   = '게임 시작전';
				gameStatus.statusColor = 'teal';
				gameStatus.statusIcon  = 'video play outline';
				break;
			case 'started':
				gameStatus.statusMsg   = '게임 진행중';
				gameStatus.statusColor = 'orange';
				gameStatus.statusIcon  = 'loading spinner';
				break;
			case 'end':
				gameStatus.statusMsg   = '게임 완료';
				gameStatus.statusColor = 'grey';
				gameStatus.statusIcon  = 'history';
				break;
			default:
		}

		gameStatus.isCreator = (Meteor.userId() === creatorID) ? true : false;
		gameStatus.roomID    = this._id;
		gameStatus.creatorID = this.creatorID;

		return gameStatus;
	}
});

Template.sadariRooms.events({
	'click .sadari-rooms .remove.icon': function(event, instance) {
		var roomInfo = this;
		var numOfUsers = _.size(instance.usersIn);

		if(numOfUsers === 0) {
			Meteor.call("sadariRoomRemove", roomInfo.roomID, roomInfo.creatorID, function(error, result){
	      if(error){
	      }
	      if(result){
	      }
	    });
		} else {
			$('.delete.error.small.modal').modal({blurring: true}).modal('show');
		}
	},
	'click .onGoingGames': function(event, instance) {
		event.preventDefault();
		if(!$(event.currentTarget).hasClass(ACTIVE_ROOM_BTN)) {
			// remove active in the sibling buttons
			$(event.currentTarget).siblings().removeClass(ACTIVE_ROOM_BTN);
			// add active to the button
			$(event.currentTarget).addClass(ACTIVE_ROOM_BTN + ' loading');
			instance.whichRooms.set('onGoingGames');
		}
	},
	'click .finishedGames': function(event, instance) {
		event.preventDefault();
		if(!$(event.currentTarget).hasClass(ACTIVE_ROOM_BTN)) {
			// remove active in the sibling buttons
			$(event.currentTarget).siblings().removeClass(ACTIVE_ROOM_BTN);
			// add active to the button
			$(event.currentTarget).addClass(ACTIVE_ROOM_BTN + ' loading');
			instance.whichRooms.set('finishedGames');
		}
	},
	'click .allGames': function(event, instance) {
		event.preventDefault();
		if(!$(event.currentTarget).hasClass(ACTIVE_ROOM_BTN)) {
			// remove active in the sibling buttons
			$(event.currentTarget).siblings().removeClass(ACTIVE_ROOM_BTN);
			// add active to the button
			$(event.currentTarget).addClass(ACTIVE_ROOM_BTN + ' loading');
			instance.whichRooms.set('allGames');
		}
	},
	'click .sadari-rooms a.room-title': function(event, instance) {
		event.preventDefault();
		// chrome mobile screen top fix
		$(window).scrollTop(0);

		if(this.gameStage === 'started') {
			alert('게임 진행중에는 입장을 할 수 없습니다.');
			return;
		}

		Router.go('sadari.RoomByID', {_id: $(event.currentTarget).data('href')});
	},
	'click .load-more': function (event, instance) {
    event.preventDefault();

    // get current value for limit, i.e. how many posts are currently displayed
    var limit = instance.limit.get();

    // increase limit by 5 and update it
    limit += ROOMS_INCREMENT;
    instance.limit.set(limit);
	},
	'click .go-up, click .author': function (event, instance) {
    // event.preventDefault();
		$(window).scrollTop(0);
	}
});
