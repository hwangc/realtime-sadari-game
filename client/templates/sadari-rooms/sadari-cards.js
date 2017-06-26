Template.sadariCard.onCreated(function() {
	var template = this;
});

Template.sadariCard.helpers({
	getRoomByID: function() {
		return { _id: this._id };
	},
	getUsername: function() {
		return {username: Meteor.users.findOne({_id: this.creatorID}).username};
	},
	enteredUsers: function() {
		var enteredUsers = Meteor.users.find({'roomID': this._id}).count();
		return enteredUsers;
	},
	creator: function() {
		return Meteor.users.findOne({_id: this.creatorID}).username;
	},
	createdDate: function() {
		return fromNowReactive(moment(this.createdAt));
	},
	gameStatus: function() {
		var playersNum   = this.playersNum;
		var enteredUsers = Meteor.users.find({'roomID': this._id}).count();
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

Template.sadariCard.events({
	'click .sadari-rooms .remove.icon': function(event, template) {
		var roomInfo = this;
		var numOfUsers = Meteor.users.find( {roomID: roomInfo.roomID} ).count();

		if(numOfUsers === 0) {
			Meteor.call("sadariRoomRemove", roomInfo.roomID, roomInfo.creatorID, function(error, result){
	      if(error){
	      }
	      if(result){
	      }
	    });
		} else {
			$('.small.modal').modal({blurring: true}).modal('show');
		}
	},
	'click .sadari-rooms a.room-title': function(event, template) {
		if(this.gameStage === 'started') {
			event.preventDefault();
			alert('게임 진행중에는 입장을 할 수 없습니다.');
			return;
		}
	}
})
