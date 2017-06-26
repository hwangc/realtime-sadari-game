Router.configure({
  trackPageView: true,
  notFoundTemplate: '404'
});

// Home
Router.route('/', {
  name: 'sadari.Main',
  layoutTemplate: 'sadariLayout',
  action: function() {
    this.render('sadariMain', {to: 'sadariMain'});
    this.render('sadariInit', {to: 'sadariInit'});
    this.render('homeTitle', {to: 'sadariTitle'});
    this.render('sadariRooms', {to: 'sadariRooms'});
  }
});

// Room with id
Router.route( '/room/:_id', {
  name: 'sadari.RoomByID',
  // loadingTemplate: 'sadariLoading',
  subscriptions: function() {
    return [
      Meteor.subscribe("sadariTheRoom", this.params._id),
      Meteor.subscribe("sadariUsersInTheRoom", this.params._id),
    ];
  },
  data: function() {
    return {
      roomInfo: SadariRooms.find( {_id: this.params._id} ),
      userInfo: Meteor.users.find( {roomID: this.params._id}, { sort: {enterTime: 1} } ),
    };
  },
  onBeforeAction: function() {

    if(!Meteor.userId()) {
      Router.go('sadari.Login', {}, {query: 'redirectTo=sadari.RoomByID&roomID='+this.params._id});
      return;
    }
    if(this.ready()) {
      var roomInfo = this.data().roomInfo.fetch()[0];

      if(typeof roomInfo === 'undefined') {
        Router.go('sadari.Main');
        return;
      }
    }

    this.next();
  },
  onAfterAction: function() {
    // The SEO object is only available on the client.
    // Return if you define your routes on the server, too.
    if (!Meteor.isClient) {
      return;
    }

    if(this.ready()) {
      var roomInfo = this.data().roomInfo.fetch()[0];

      SEO.set({
        title: roomInfo.title + ' - 사다리 게임 방',
        meta: {
          'description': roomInfo.description
        },
        og: {
          'title': roomInfo.title,
          'url'  : 'http://sadari.hwangc.com/room/'+this.params._id,
          'description': roomInfo.description
        },
        twitter: {
          'url'  : 'http://sadari.hwangc.com/room/'+this.params._id,
        }
      });
    }
  },
  action: function() {
    if(this.ready()) {
      this.render('sadariRoom');
    } else {
      this.render('sadariLoading');
    }
  }
});

// login register
Router.route( '/login', {
  name: 'sadari.Login',
  layoutTemplate: 'sadariLayout',
  template: 'sadariLogin',
  onBeforeAction: function() {
    if(Meteor.userId()) {
      Router.go('sadari.Main');
    } else {
      this.next();
    }
  },
  data: function() {
    return {
      slug: this.params.query.slug,
      roomID: this.params.query.roomID,
      redirectTo: this.params.query.redirectTo,
    };
  },
  action: function() {
    this.render('sadariAuth', {to: 'sadariMain'});
    this.render('sadariLogin', {to: 'sadariAuth'});
  }
});

Router.route( '/register', {
  name: 'sadari.Register',
  layoutTemplate: 'sadariLayout',
  template: 'sadariRegister',
  onBeforeAction: function() {
    if(Meteor.userId()) {
      Router.go('sadari.Main');
    } else {
      this.next();
    }
  },
  action: function() {
    this.render('sadariAuth', {to: 'sadariMain'});
    this.render('sadariRegister', {to: 'sadariAuth'});
  }
});

Router.route( '/forgotpw', {
  name: 'sadari.ForgotPw',
  layoutTemplate: 'sadariLayout',
  template: 'sadariForgotPw',
  onBeforeAction: function() {
    if(Meteor.userId()) {
      Router.go('sadari.Main');
    } else {
      this.next();
    }
  },
  action: function() {
    this.render('sadariAuth', {to: 'sadariMain'});
    this.render('sadariForgotPw', {to: 'sadariAuth'});
  }
});

Router.route( '/:username/rooms', {
  name: 'sadari.MyRooms',
  layoutTemplate: 'sadariLayout',
  onAfterAction: function() {
    // The SEO object is only available on the client.
    // Return if you define your routes on the server, too.
    if (!Meteor.isClient) {
      return;
    }

    if(this.ready()) {
      var username = this.params.username;

      SEO.set({
        title: username + '님의 사다리 게임 방',
        meta: {
          'description': username + '님의 사다리 게임 방',
        },
        og: {
          'title': username + '님의 사다리 게임 방',
          'url'  : 'http://sadari.hwangc.com/' + this.params.username + '/rooms',
          'description': username + '님의 사다리 게임 방',
        },
        twitter: {
          'url'  : 'http://sadari.hwangc.com/' + this.params.username + '/rooms',
        }
      });
    }
  },
  action: function() {
    this.render('sadariMain', {to: 'sadariMain'});
    this.render('sadariInit', {to: 'sadariInit'});
    this.render('myRoomsTitle', {to: 'sadariTitle'});
    this.render('sadariRooms', {to: 'sadariRooms'});
  }
});
