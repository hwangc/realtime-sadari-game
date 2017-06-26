Template.observerCtrl.helpers({
  gameStage: function(stage) {
    if(this.roomInfo.fetch()[0].gameStage === stage) {
      return true;
    }

    return false;
  }
});
