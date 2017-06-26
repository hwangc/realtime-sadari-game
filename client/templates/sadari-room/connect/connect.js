Template.commonConnect.helpers({
  connected: function() {
    return Meteor.status().connected;
  }
});
