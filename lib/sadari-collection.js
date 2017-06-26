// Sadari Game rooms collection
SadariRooms = new Mongo.Collection('sadariRooms');
/*
SadariRoomsPages = new Meteor.Pagination(SadariRooms, {
  perPage: 6,
  router: "iron-router",
  homeRoute: ["/", "/rooms/"],
  route: "/rooms/",
  itemTemplate: 'sadariCard',
  routerTemplate: "sadariCards",
  templateName: "sadariCards",
  routerLayout: "sadariMain",
  divWrapper: false,
  sort: {
    createdAt: -1
  }
});
*/

SadariRooms.after.insert(function(userId, doc) {
  SadariRooms.update(doc._id, {$set:{creatorName: Meteor.users.findOne({_id:doc.creatorID}).username}});
});

Meteor.users.after.update(function(userId, doc, fieldNames, modifier, options) {
  modifier.$set = modifier.$set || {};

  if(modifier.$set.roomID) {
    SadariRooms.update(modifier.$set.roomID, {$addToSet:{usersIn: userId}});
  } else if(this.previous.roomID && !doc.roomID) {
    SadariRooms.update(this.previous.roomID, {$pull:{usersIn: userId}});
  }
});

// Sadari Game rooms chatting collection
SadariChats = new Mongo.Collection('sadariChats');
