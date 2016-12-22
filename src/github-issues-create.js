// Description:
//  Create github issues with hubot
//
// Commands:
//  hubot issues create for [user/][repo] [issue title]
//
// Author:
//  wireframe
var githubot = require('githubot');
var parseArgs = require('cli-argparse');
var parse = require('shell-quote').parse;

module.exports = function(robot) {
  var handleTokenError, parseBody, parseLabels, parseMilestone;
  handleTokenError = function(res, err) {
    var auth_url;
    switch (err.type) {
      case 'redis':
        res.reply("Oops: " + err);
      case 'github user':
        auth_url = process.env.HEROKU_URL + "/github/identity";
        res.reply("Sorry, you haven't told me your GitHub username.  Enter your Github API token at " + auth_url + " and then tell me who you are\n\n> " + robot.name + " I am GITHUB_USERNAME");
    }
  };

  // parse message input into github issue payload
  parseIssue = function(message) {
    var args = parse(message);
    var result = parseArgs(args);
    var args = result.options;
    var payload = {};
    payload.title = result.unparsed.join(' ');
    payload.milestone = args.milestone;
    payload.body = args.body;
    payload.labels = (args.labels || '').split(',');
    return payload;
  };

  robot.respond(/issues create (in\s|for\s)?(\S+)\s([\s\S]*)/i, function(res) {
    var repo = githubot.qualified_repo(res.match[2]);
    var payload = parseIssue(res.match[3]);
    var user = res.envelope.user.name;
    robot.identity.findToken(user, function(err, token) {
      if (err) {
        handleTokenError(res, err);
      } else {
        var github = githubot(robot, {
          token: token
        });
        github.handleErrors(function(response) {
          res.reply("Error creating issue for repo '" + repo + "': " + response.statusCode + " " + response.error);
        });
        var url = "/repos/" + repo + "/issues";
        github.post(url, payload, function(issue) {
          res.reply("I've opened issue #" + issue.number + " for you\n" + issue.html_url);
        });
      }
    });
  });
};
