Template.myRoomsTitle.helpers({
  username: function() {
    return Router.current().params.username;
  },
  userGames: function(who) {
    return SadariRooms.find({creatorName:who.hash.user}).count();
  }
});
