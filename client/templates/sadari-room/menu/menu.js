Template.commonMenu.events({
  "click .sadari-room-chat": function(event, template){
    event.preventDefault();
    // disable the control button
    $('.control-footer .button').attr('disabled',true);
    // showing multiple
    $('.chat.sidebar')
      .sidebar({
        context: $('.sadari-room'),
        transition: 'overlay',
        mobileTransition: 'overlay',
        onVisible: function() {
          var chatWindowHeight = setChatWindowHeight('.chat input', '.chat .ui.header');

          // chat window size
          $('.chat.window').attr('style', function(i,s) {
            var heightAttr = 'height:' + chatWindowHeight + 'px !important;';

            if(s) {
              return s + heightAttr;
            }

            return heightAttr;
          });
        },
        onShow: function() {
          if(!$('.chat.window').hasClass('overlay')) {
            $('.chat.window').addClass('overlay');
          }
          // scroll to bottom
          $('.chat.window').scrollTop($('.chat.window')[0].scrollHeight);
          $('.chat input').focus();
        }
      })
      .sidebar('attach events', '.close.icon', 'hide')
      .sidebar('toggle');
  }
});

Template.commonMenu.onRendered(function() {
  var template = this;

  // set the enter key event for gameStage submit
  $(document).keyup(function(e) {
      if(e.which == 27) {
        e.preventDefault();
        template.$('.sadari-init-pull').trigger('click');
      }
  });
});

setChatWindowHeight = function(chatInputEl, chatHeaderEl) {
  // pusher height
  var pusherHeight = $('.sadari-room .pusher').outerHeight();
  // input height
  var chatInputHeight = $(chatInputEl).outerHeight();
  // header height
  var chatHeaderHeight = $(chatHeaderEl).outerHeight();

  return pusherHeight - chatInputHeight - chatHeaderHeight;
}
