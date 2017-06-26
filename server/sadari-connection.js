UserStatus.events.on("connectionLogin", function(fields) {
  // console.log("=========== connectionLogin ===========");
  // SadariRooms.update({}, { $pull: { usersIn : { $in: [fields.userId] } } }, {multi:true});
});

UserStatus.events.on("connectionLogout", function(fields) {
  // console.log("=========== connectionLogout ===========");
  SadariRooms.update({}, { $pull: { usersIn : { $in: [fields.userId] } } }, {multi:true});
});

UserStatus.events.on("connectionIdle", function(fields) {
  // console.log('=========== idle ===========');
  SadariRooms.update({}, { $pull: { usersIn : { $in: [fields.userId] } } }, {multi:true});
});
// 
// UserStatus.events.on("connectionActive", function(fields) {
//   console.log("=========== connectionActive ===========");
//   console.log(fields);
// });
