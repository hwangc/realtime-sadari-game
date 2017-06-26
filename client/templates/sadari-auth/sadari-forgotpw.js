var ERRORS_KEY = 'forgotPwErrors';

Template.sadariForgotPw.onCreated(function() {
  Session.setDefault(ERRORS_KEY, {});
});

Template.sadariForgotPw.helpers({
  errorMessages: function() {
    return _.values(Session.get(ERRORS_KEY));
  },
  errorClass: function(key) {
    return Session.get(ERRORS_KEY)[key] && 'error';
  }
});

Template.sadariForgotPw.events({
  'submit form': function(event, instance) {

    event.preventDefault();
    var emailVar = event.target.loginEmail.value;
    var $errorMsg = instance.$('.error.message');
    var $sendingMsg = instance.$('.email.sending');
    var errors = {};

    // init the error msg
    $errorMsg.hide();

    // valid email
    if (! emailVar) {
      errors.email = '이메일을 입력하세요.';
    } else if( !validateEmail(emailVar) ) {
      errors.email = '잘 못된 이메일 주소입니다.';
    }

    // when there is any error
    Session.set(ERRORS_KEY, errors);
    if (_.keys(errors).length) {
      $errorMsg.show();
      return;
    }

    // show the sending msg
    $sendingMsg.toggleClass('hidden visible');

    // forgotPassword
    Accounts.forgotPassword({email: emailVar}, function(error) {
      if (error) {
        Session.set(ERRORS_KEY, {'none': '이메일을 다시 확인하세요.'});
        $sendingMsg.toggleClass('hidden visible');
        $errorMsg.show();
        return error.reason;
      }
      $sendingMsg.toggleClass('hidden visible');
      instance.$('.positive.email.sent.message').toggleClass('hidden visible');
    });
  }
});

Template.sadariForgotPw.onRendered(function() {

  var instance = this;

  instance.$('.message .close').on('click', function() {
    $(this).closest('.message').transition('fade');
  });
});
