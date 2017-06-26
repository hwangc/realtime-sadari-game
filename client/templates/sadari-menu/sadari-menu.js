Template.sadariMenu.onCreated(function() {
  var instance = this;
  instance.subscribe("sadariRoomCountOfTheUser");
});

Template.sadariMenu.helpers({
  username: function() {
    return Meteor.user().username;
  },
  getUsername: function() {
    if(Meteor.userId()) {
      return {username: Meteor.user().username};
    }
	},
  active: function(whichMenu) {
    var routerName = Router.current().route.getName();

    if(routerName === 'sadari.'+whichMenu) {
      if(whichMenu === 'MyRooms') {
        if(Meteor.userId()) {
          var routerParam = Router.current().params.username;

          if(routerParam === Meteor.user().username) {
            return 'active';
          }
        }
      } else {
        return 'active';
      }
    }
  }
});

Template.sadariMenu.events({
  'click .login': function() {
    Router.go('sadari.Login',{},{query:'redirectTo=sadari.Main'});
  },
  'click .logout': function() {
    Meteor.logout(function(error) {
      if(error) {
        return '로그아웃 에러';
      }
      Router.go('sadari.Main');
    })
  }
});
