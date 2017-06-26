var $playersForm;

Template.sadariMain.onCreated(function() {
  var instance = this;

  if(Meteor.userId() && !UserStatus.isMonitoring()) {
    userStatusMonitorStart(1800, 2000, false); //30min idle, 2sec interval
  }

  instance.autorun(function(c) {

    if(!Meteor.userId()) {
      c.stop();
      return;
    }

    if(Session.get('roomLeave')) {
      $('.idle.room.leave.small.modal').modal({blurring: true}).modal('hide');
    }
    /*
    // let idle user logout
  	if(UserStatus.isIdle()) {

      Meteor.logout(function(){
        $('.idle.site.logout.small.modal').modal({
          blurring: true,
          closable: false,
          onApprove: function() {
            userStatusMonitorStop();
          },
          onDeny: function() {
            Router.go('sadari.Login', {}, {query: 'redirectTo=sadari.Main'});
          }
        }).modal('show');
      });
  	}
    */
  });
});

Template.sadariMain.helpers({
  connected: function() {
    return Meteor.status().connected;
  }
});

Template.sadariMain.onRendered(function(){

  var template = this;

  $playersForm = template.$('.sadari-init form');

  // check the room leave from rooms
  if( Session.get('roomLeave') ) {
    $('.idle.room.leave.small.modal').modal({blurring: true}).modal('show');
  }

});

Template.sadariMain.events({
  'click .sadari-init .submit.button': function(event, template) {

    if(Meteor.user()) {

      event.preventDefault();

      var $submitBtn = template.$(event.currentTarget);

      if( $playersForm.form('is valid') ) {

        $submitBtn.attr('disabled','disabled');
        $submitBtn.addClass('loading disabled');
        // creat a sadariInit play room
        var formValue = $playersForm.form('get values');
        var isOpen = Session.get('isOpen');
        var creatorID = Meteor.userId();

        Meteor.call("sadariRoomCreate", formValue, isOpen, creatorID, function(error, result){
          if(error){
            return error.reason;
          }
          if(result){

            var roomID = result;

            $('.sadari-main').transition({
              animation: 'fade down',
              onComplete: function() {
                $submitBtn.attr('disabled',false);
                $submitBtn.removeClass('loading disabled');
                Router.go('sadari.RoomByID',{ _id: roomID });
              }
            });
          }
        });
      }
    } else {
      event.preventDefault();
      Router.go('sadari.Login', {}, {query: 'redirectTo=sadari.Main'});
    }
  },
  'click .sadari-init .reset.button': function(event, template) {
    template.$('.sadari-init form').form('reset');
  },
  'change .open-secret>input': function(event, template) {

    $playersForm.form('set value', 'password', '');

    var isOpen = ($playersForm.form('get value', 'isOpen') === "true") ? true : false;
    Session.set('isOpen',isOpen);
  }
});
