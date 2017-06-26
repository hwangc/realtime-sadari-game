Template.sadariLoading.onRendered(function() {
  var instance = this;

  instance.$('.sadari-loading').css('height', $(window).height()).children('.loader').toggleClass('hidden visible');
});
