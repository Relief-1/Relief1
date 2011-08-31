var crypto = require('crypto');
var testCase = require('nodeunit').testCase;

var settings = require('../lib/settings');
settings.__reload('test');
var db = require('../lib/db').db;
var login = require('../lib/login');

module.exports = testCase({
  setUp: function (callback) {
    var hash = crypto.createHash(settings.loginManager.hash);
    var salt = 'salt';
    
    this.login = new login.Login();

    this.email = 'test@example.com';
    this.password = 'password';
    hash.update(salt + this.password);
    this.user = {
      hash: hash.digest('hex'),
      salt: salt
    };
    var obj = this;
    db.save(encodeURIComponent('user-' + this.email), this.user, 
      function (err, res) {
        if (err)
          callback(err);
        obj.id = res.id;
        obj.rev = res.rev;
        callback();
      });
  },
  testCorrectLogin: function (test) {
    test.expect(2);
    var obj = this;
    this.login.userLogin(this.email, this.password, function (err, doc) {
      test.equal(err, null, 'there should be no error with correct credentials');
      test.equal(doc.id, obj.id);
      test.done();
    });
  },
  testWrongPassword: function (test) {
    test.expect(2);
    this.login.userLogin(this.email, this.password + '-not-really', 
      function (err, doc) {
        test.ok(err, 'should return error when wrong password is supplied');
        test.equal(doc, null, 'there should be no document returned');
        test.done();
      });
  },
  testWrongLogin: function (test) {
    test.expect(2);
    this.login.userLogin(this.email + '-not-really', this.password, 
      function (err, doc) {
        test.ok(err, 'should return error when wrong login is supplied');
        test.equal(doc, null, 'there should be no document returned');
        test.done();
    });
  },
  testSaltGeneration: function (test) {
    var salt = this.login.saltGenerate();
    test.equal(salt.length, settings.loginManager.saltLength);
    test.done();
  },
  testUserRegister: function (test) {
    // TODO: test for invalid emails
    test.expect(3);
    var email = 'some-email@test.com';
    var id = 'user-' + encodeURIComponent(email);
    var password = 'ninja';
    this.login.userRegister(email, password, function (err, res) {
      test.ok(!err, "shouldn't return error with valid data");

      var rev = res.rev;

      db.get(id, function (err, doc) {
        test.ok(!err, 'there should be no error when getting new user from DB');
        test.equal(
          doc.salt.length,
          settings.loginManager.saltLength,
          "salt's length should be equal to one in settings"
        );
        db.remove(id, rev, function () {});
        test.done();
      });
    });
  },
  testRegisterExistingUser: function (test) {
    var self = this;

    test.expect(3);
    this.login.userRegister(this.email, 'whatever', function (err, res) {
      test.ok(err, 'should return error when trying to register existing user');
      test.equal(err.code, login.Login.USER_EXISTS, 'should return proper error code');

      db.get(self.id, function (err, doc) {
        test.equal(doc._rev, self.rev, 'document should not get overriden');
        test.done();
      });
    });
  },
  tearDown: function (callback) {
    db.remove(this.id, this.rev, callback);
  }
});

