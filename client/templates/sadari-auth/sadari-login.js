var ERRORS_KEY = 'signinErrors';

Template.sadariLogin.onCreated(function() {
  Session.setDefault(ERRORS_KEY, {});
});

Template.sadariLogin.helpers({
  errorMessages: function() {
    return _.values(Session.get(ERRORS_KEY));
  },
  errorClass: function(key) {
    return Session.get(ERRORS_KEY)[key] && 'error';
  }
});

Template.sadariLogin.events({
  'submit form': function(event, template) {

    event.preventDefault();
    var emailVar = event.target.loginEmail.value;
    var passwordVar = event.target.loginPassword.value;
    var $errorMsg = template.$('.error.message');
    var errors = {};

    // init the error msg
    $errorMsg.hide();

    if (! emailVar) {
      errors.email = '이메일을 입력하세요.';
    }

    if (! passwordVar) {
      errors.password = '비밀번호를 입력하세요.';
    }

    Session.set(ERRORS_KEY, errors);
    if (_.keys(errors).length) {
      $errorMsg.show();
      return;
    }

    Meteor.loginWithPassword(emailVar, passwordVar, function(error) {
      if (error) {
        Session.set(ERRORS_KEY, {'none': '이메일이나 패스워드를 다시 확인하세요.'});
        $errorMsg.show();
        return error.reason;
      }

      // logout other clients
      Meteor.logoutOtherClients(function(error) {
        if(error) {
          console.log(error);
          return;
        }
      });

      Router.go(template.data.redirectTo, {_id: template.data.roomID});
    });
  }
});
