// Publish Sadari game rooms
Meteor.publish('sadariRooms_allGames', function (limit) {
	Counts.publish(this, 'roomCounter', SadariRooms.find(), {noReady:true});
	return SadariRooms.find({},{sort:{createdAt:-1}, limit:limit});
});

// Publish Sadari game rooms ongoing
Meteor.publish('sadariRooms_onGoingGames', function (limit) {
	Counts.publish(this, 'roomCounter', SadariRooms.find({isGameFinished:false}), {noReady:true});
	return SadariRooms.find({isGameFinished:false},{sort:{createdAt:-1}, limit:limit});
});

// Publish Sadari game rooms finished
Meteor.publish('sadariRooms_finishedGames', function (limit) {
	Counts.publish(this, 'roomCounter', SadariRooms.find({isGameFinished:true}), {noReady:true});
	return SadariRooms.find({isGameFinished:true},{sort:{createdAt:-1}, limit:limit});
});

// Publish the Sadari game room
Meteor.publish('sadariTheRoom', function (roomID) {
	return SadariRooms.find({_id:roomID});
});

// Publish the user's sadari rooms
Meteor.publish("sadariRoomsOfTheUser_allGames", function (username, limit) {
	var creatorID = Meteor.users.findOne({username: username})._id;
	Counts.publish(this, 'roomCounter', SadariRooms.find({creatorID:creatorID}), {noReady:true});
  return SadariRooms.find({creatorID:creatorID},{sort:{createdAt:-1}, limit:limit});
});

// Publish the user's sadari rooms
Meteor.publish("sadariRoomsOfTheUser_onGoingGames", function (username, limit) {
	var creatorID = Meteor.users.findOne({username: username})._id;
	Counts.publish(this, 'roomCounter', SadariRooms.find({creatorID:creatorID, isGameFinished:false}), {noReady:true});
  return SadariRooms.find({creatorID:creatorID,isGameFinished:false},{sort:{createdAt:-1}, limit:limit});
});

// Publish the user's sadari rooms
Meteor.publish("sadariRoomsOfTheUser_finishedGames", function (username, limit) {
	var creatorID = Meteor.users.findOne({username: username})._id;
	Counts.publish(this, 'roomCounter', SadariRooms.find({creatorID:creatorID, isGameFinished:true}), {noReady:true});
  return SadariRooms.find({creatorID:creatorID,isGameFinished:true},{sort:{createdAt:-1}, limit:limit});
});

// All users in all rooms
Meteor.publish("sadariUsersInAllRooms", function () {
    return Meteor.users.find({});
});

// Users in a room
Meteor.publish("sadariUsersInTheRoom", function (roomID) {
    return Meteor.users.find({roomID:roomID}, {fields: { 'roomID':1, enterTime: 1, username: 1, gameReady: 1, sitNum: 1, status: 1 }});
});

// sadari chats
Meteor.publish("sadariChats", function(roomID, limit){
	Counts.publish(this, 'chatCounter', SadariChats.find({roomID:roomID}), {noReady:true});
	return SadariChats.find({roomID:roomID}, {sort:{createdAt:-1}, limit: limit});
});

if(Meteor.isServer){
	// user Sadari game rooms count
	Meteor.publish('sadariRoomCountOfTheUser', function () {
		Counts.publish(this, 'roomCounterOfTheUser', SadariRooms.find({creatorID:this.userId}));
	});
}
