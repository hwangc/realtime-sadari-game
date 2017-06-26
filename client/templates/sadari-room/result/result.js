var COM_NAME = '컴퓨터';

Template.roomResult.onCreated(function() {

  var template = this;

  template.autorun(function(){
    var roomInfo = Template.currentData().roomInfo.fetch()[0];
    var $looserEl = $('.looser');
    var $checkboxEl = $('.play.result .checkbox');
    // when a user visit a finished game or game finished, it will show the result
    if (roomInfo.isGameFinished) {
      $checkboxEl.show().checkbox({
        onChecked: function() {
          // show only prize winners
          $looserEl.toggle();
        },
        onUnchecked: function() {
          // show all results
          $looserEl.toggle();
        }
      });
    } else {
      // only show when the game finished
      $checkboxEl.hide();
    }
  });
});

Template.roomResult.onRendered(function() {
  var template    = this;
  var roomInfo    = template.data.roomInfo.fetch()[0];
  var $looserEl   = $('.looser');
  var $checkboxEl = $('.play.result .checkbox');

  // when a user visit a finished game or game finished, it will show the result
  if (roomInfo.isGameFinished) {

    $checkboxEl.show().checkbox({
      onChecked: function() {
        // show only prize winners
        $looserEl.toggle();
      },
      onUnchecked: function() {
        // show all results
        $looserEl.toggle();
      }
    });
  } else {
    // only show when the game finished
    $checkboxEl.hide();
  }

  // accordion
  $('.play.result').accordion();
});

Template.roomResult.helpers({
  result: function() {

    var roomInfo = Template.instance().data.roomInfo.fetch()[0];

    if (roomInfo.isGameFinished) {
      return roomInfo.results;
    }
    // nothing to return because the game is not yet finished
    return;
  },
  isCom: function() {
    var thisResult = this;
    if(this.player === COM_NAME) {
      return true;
    }
    return false;
  }
});

Template.roomResult.events({
  'click .result .item': function(event, template) {

    var userLineNum = this.startLine;
    var $allPlayersLines = $('#resultDraw path');
    var $allUserItem = template.$('.result .item');
    var $thisPlayerLine = $('#playerLine-'+userLineNum);
    var $thisUserItem = $(event.currentTarget);
    var $boardDraw = $('.board-draw');
    var ACTIVE = 'active';
    var playerElTag = 'player';
    var controlElTag = 'control';
    var normalStroke = 4;
    var highlightedStroke = 12;

    if($thisUserItem.hasClass(ACTIVE)) {
      $allPlayersLines.attr('stroke-width', normalStroke);
      $allPlayersLines.show();
      $allUserItem.removeClass(ACTIVE);
      $('.'+playerElTag).removeClass(ACTIVE);
    } else {
      $thisPlayerLine.attr('stroke-width', highlightedStroke);
      $allPlayersLines.hide();
      $thisPlayerLine.show();
      // scroll to the player
      $boardDraw.scrollLeft(
        $boardDraw.scrollLeft() +
        $('#'+userLineNum+'-'+playerElTag).parent('.'+playerElTag).offset().left -
        $('.'+controlElTag).outerWidth()
      );
      $('.'+playerElTag).removeClass(ACTIVE);
      $('#'+userLineNum+'-'+playerElTag).parent('.'+playerElTag).addClass(ACTIVE);
      $allUserItem.removeClass(ACTIVE);
      $thisUserItem.addClass(ACTIVE);
    }
  }
});
