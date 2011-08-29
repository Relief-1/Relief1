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
  tearDown: function (callback) {
    db.remove(this.id, this.rev, callback);
  }
});

