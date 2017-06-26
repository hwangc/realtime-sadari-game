Template.drawStart.onCreated(function() {

});

Template.drawStart.helpers({
  gameStage: function(stage){
    if(this.roomInfo.fetch()[0].gameStage === stage) {
      return true;
    }

    return false;
  }
});

Template.drawStart.onRendered(function() {

});
