Template.commonChatInput.events({
  "click .chat.input .submit.button": function(event, template){
    if(Meteor.user()) {

      event.preventDefault();

      var $submitBtn = template.$(event.currentTarget);
      $submitBtn.attr('disabled',true);
      $submitBtn.addClass('loading disabled');
      var submitTxt = template.$(event.currentTarget).siblings('input').val();
      var roomID = template.data.roomInfo.fetch()[0]._id;

      if($submitBtn.attr('disabled') && !submitTxt) {
        $submitBtn.attr('disabled',false);
        $submitBtn.removeClass('loading disabled');
        return;
      }

      if(!submitTxt) {
        return;
      }

      if(submitTxt.length > 1000) {
        $('.chat.input').children('input').attr('placeholder','문장을 짧게 입력하세요.').val('');
        return;
      }

      Meteor.call("sadariChats", roomID, Meteor.user().username, submitTxt, function(error, result){
        if(error){
          return error.reason;
        }
        if(result){
          template.$('.chat.input .submit.button').siblings('input').val('');
          $('.chat.window').scrollTop($(".chat.window")[0].scrollHeight);
          // enable the submit button
          $submitBtn.attr('disabled',false);
          $submitBtn.removeClass('loading disabled');
          $('.chat.input input').focus();
        }
      });
    }
  }
});

Template.commonChatInput.onRendered(function() {
  var instance = this;
  // set the enter key event for gameStage submit
  $('.chat.input').keypress(function(e) {
    if(e.which == 13) {
      e.preventDefault();
      instance.$('.chat.input .submit.button').trigger('click');
    }
  });
});
