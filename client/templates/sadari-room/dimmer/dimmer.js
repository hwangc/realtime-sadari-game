Template.sadariDimmer.helpers({
  description: function(){
    return this.roomInfo.fetch()[0].description;
  }
});
