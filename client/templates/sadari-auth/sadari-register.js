var ERRORS_KEY = 'signupErrors';

Template.sadariRegister.onCreated(function() {
  Session.setDefault(ERRORS_KEY, {});
});

Template.sadariRegister.helpers({
  errorMessages: function() {
    return _.values(Session.get(ERRORS_KEY));
  },
  errorClass: function(key) {
    return Session.get(ERRORS_KEY)[key] && 'error';
  }
});

Template.sadariRegister.events({
  'submit form': function(event, instance) {

    event.preventDefault();
    var emailVar = event.target.registerEmail.value;
    var passwordVar = event.target.registerPassword.value;
    var userNameVar = event.target.registerUserName.value;
    var $errorMsg = instance.$('.error.message');
    var errors = {};

    // init the error msg
    $errorMsg.hide();

    if (! emailVar) {
      errors.email = '이메일을 입력하세요.';
    } else if( !validateEmail(emailVar) ) {
      errors.email = '잘 못된 이메일 주소입니다.';
    }

    if (! passwordVar) {
      errors.password = '비밀번호를 입력하세요.';
    }

    if (! userNameVar) {
      errors.username = '사용자 이름을 입력하세요.';
    } else if( userNameVar.length < 3 ) {
      errors.username = '사용자 이름은 5자 이상으로 입력하세요.';
    } else if( userNameVar.length > 10 ) {
      errors.username = '사용자 이름은 10자 이하로 입력하세요.';
    } else if( !validateUsername(userNameVar) ) {
      errors.username = '사용자 이름은 영문 또는 숫자로 만들어주세요.';
    }

    Session.set(ERRORS_KEY, errors);
    if (_.keys(errors).length) {
      $errorMsg.show();
      return;
    }

    Accounts.createUser({
      username: userNameVar,
      email: emailVar,
      password: passwordVar
    }, function(error) {
      if(error) {
        if(error.reason === 'Username already exists.') {

          Session.set(ERRORS_KEY, {'none': '이미 사용중인 사용자 이름입니다.'});
          $errorMsg.show();
          return error.reason;
        }

        if(error.reason === 'Email already exists.') {

          Session.set(ERRORS_KEY, {'none': '이미 사용중인 이메일 주소입니다.'});
          $errorMsg.show();
          return error.reason;
        }
      }

      Router.go('sadari.Main');
    });
  }
});
