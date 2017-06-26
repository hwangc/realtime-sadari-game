Meteor.startup(function(){
  smtp = {
    username: 'hwangc@hwangc.com',   // eg: server@gentlenode.com
    password: Meteor.settings.mailPassword,   // eg: 3eeP1gtizk5eziohfervU
    server:   'smtp.gmail.com',      // eg: mail.gandi.net
    port: 587
  }

  process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;
});
