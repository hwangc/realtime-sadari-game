const CHATS_INCREMENT = 30;

Template.commonChatWindow.onCreated(function() {
  var instance = this;
  var roomID = Router.current().params._id;

  instance.loaded = new ReactiveVar(0);
  instance.limit  = new ReactiveVar(CHATS_INCREMENT);
  instance.update = new ReactiveVar(false);

  instance.autorun(function () {
    // get the limit
    var limit = instance.limit.get();
    var sadariChatsSub = instance.subscribe("sadariChats", roomID, limit);
    // subscribe to the posts publication
    var subscriptionReady = instance.subscriptionsReady();

    // if subscription is ready, set limit to newLimit
    if (subscriptionReady) {
      instance.loaded.set(limit);
    }

    if(instance.update.get()) {
      setTimeout(function() {
        var $chatWindow = instance.$('.chat.window');
        $chatWindow.scrollTop(0);
        instance.update.set(true);
      }, 400);
    } else {
      setTimeout(function() {
        var $chatWindow = instance.$('.chat.window');
        $chatWindow.scrollTop($chatWindow.prop("scrollHeight"));
      }, 200);
    }

  });

  instance.message = function() {
    // show the new message on the bottom when the count changes
		return SadariChats.find({roomID:roomID}, {sort: {createdAt:1}, limit: instance.loaded.get()});
	};
});

Template.commonChatWindow.helpers({
  message: function() {
		return Template.instance().message();
  },
  role: function() {
    var message = this;

    if(message.author === Meteor.user().username) {
      return 'me';
    }

    return 'others';
  },
  me: function() {
    var message = this;

    if(message.author === Meteor.user().username) {
      return true;
    }

    return false;
  },
  createdDate: function() {
		return moment(this.createdAt).format('YYYY/MM/DD A h:m:s');
	},
  // are there more chats to show?
  hasMoreChats: function () {
    return Counts.get('chatCounter') > Template.instance().limit.get();
  }
});

Template.commonChatWindow.events({
  "click .comments.chat .close": function(event, template){
    // enable the control button
    $('.control-footer .button').attr('disabled',false);
  },
  'click .chat.window .load-more': function (event, instance) {
    event.preventDefault();

    // get current value for limit, i.e. how many posts are currently displayed
    var limit = instance.limit.get();

    // increase limit by 5 and update it
    limit += CHATS_INCREMENT;
    instance.limit.set(limit);
    instance.update.set(true);
  },
  'click .chat.window .go-down': function (event, instance) {
    event.preventDefault();

    var $chatWindow = instance.$('.chat.window');
    $chatWindow.scrollTop($chatWindow.prop("scrollHeight"));
    $('.chat.input input').focus();
  }
});

Template.commonChatWindow.onRendered(function() {

});
