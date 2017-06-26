Template.drawBoard.onCreated(function() {

});

Template.drawBoard.helpers({
  gameStage: function(started, end){
    var gameStage = this.roomInfo.fetch()[0].gameStage;

    if( gameStage === started || gameStage === end ) {
      return true;
    }

    return false;
  }
});

Template.drawBoard.onRendered(function() {

});
