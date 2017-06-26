Template.sadariInit.onRendered(function(){

  var template = this;

  template.$('.sadari-init form')
  .form({
    fields: {
      roomname: {
        identifier: 'roomname',
        rules: [
          {
            type   : 'empty',
            prompt : '방 이름을 입력하세요.'
          },
          {
            type   : 'minLength[3]',
            prompt : '방이름을 {ruleValue}자 이상 입력하세요.'
          }
        ]
      },
      password: {
        identifier: 'password',
        rules: [
          {
            type   : 'minLength[4]',
            prompt : '패스워드는 최소 {ruleValue}자 이상 입력하세요.'
          }
        ]
      },
      players: {
        rules: [
          {
            type   : 'integer[2..20]',
            prompt : '게임은 2 ~ 20명까지만 할 수 있습니다.'
          }
        ]
      },
      roomdesc: {
        rules: [
          {
            type   : 'empty',
            prompt : '방 소개를 입력하세요.'
          },
          {
            type   : 'maxLength[150]',
            prompt : '방 소개를 {ruleValue}자 이내로 입력하세요.'
          }
        ]
      },
      terms: {
        identifier: 'terms',
        rules: [
          {
            type   : 'checked',
            prompt : '사행성 게임을 하지 말아야겠죠? 그럼 체크!'
          }
        ]
      }
    }
  })
  .submit(function(event){
    event.preventDefault();
  });

});

Template.sadariInit.helpers({
  setGame: function() {
    return Session.get('setGame');
  }
});
