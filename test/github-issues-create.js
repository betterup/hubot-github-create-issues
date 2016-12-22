// setup env
var defaultGithubOrganization = 'mycompany';
process.env.HUBOT_GITHUB_USER = defaultGithubOrganization;

var Helper = require('hubot-test-helper');
var helper = new Helper('../src/github-issues-create.js');
var chai = require('chai');
var nock = require('nock');
var expect = chai.expect;

describe('github-issues-create', function() {
  var room;

  beforeEach(function() {
    room = helper.createRoom();
    var robot = room.robot;
    // mock hubot-github-identity
    var token = 'github-fake-token';
    robot.identity = {
      findToken: function(user, callback) {
        callback(null, token);
      }
    };
    nock.disableNetConnect();
  });
  afterEach(function() {
    room.destroy();
    nock.cleanAll();
  });

  describe('when message omits organization name', function() {
    var message = 'hubot issues create myproject some title';
    beforeEach(function(done) {
      nock('https://api.github.com').
        post('/repos/mycompany/myproject/issues').
        reply(201, {
          number: 123,
          html_url: 'https://fake-github-url/some/path'
        });
      room.user.say('alice',  message);
      setTimeout(done, 100);
    });
    it('fires listener', function() {
      expect(room.messages).to.deep.equal([
        ['alice', message],
        ['hubot', "@alice I've opened issue #123 for you\nhttps://fake-github-url/some/path"]
      ]);
    });
  });
});
