// Description:
//  Create github issues with hubot
//
// Commands:
//  hubot issues create for [user/][repo] [issue title]
//
// Author:
//  wireframe
var githubot = require('githubot');

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
  parseLabels = function(rawLabels) {
    if (rawLabels) {
      return rawLabels.slice(1, -2).split(",");
    } else {
      return rawLabels;
    }
  };
  parseMilestone = function(rawMilestone) {
    if (rawMilestone) {
      return rawMilestone.slice(3, -1);
    } else {
      return rawMilestone;
    }
  };
  parseBody = function(rawBody) {
    if (rawBody) {
      return rawBody.slice(2).trim();
    } else {
      return rawBody;
    }
  };
  robot.respond(/issues create /i, function(res) {
    var match, payload, repo, user;
    match = res.message.text.match(/issues create (for\s)?(([-_\.0-9a-z]+\/)?[-_\.0-9a-z]+) (in\s[a-z0-9]+\s)?(#[a-z0-9, ]+#\s)?([^-]+)(\s-\s.+)?/i);
    repo = githubot.qualified_repo(match[2]);
    payload = {
      body: ""
    };
    payload.milestone = parseMilestone(match[4]);
    payload.labels = parseLabels(match[5]);
    payload.title = match[6].trim();
    payload.body = parseBody(match[7]);
    console.log(payload);
    user = res.envelope.user.name;
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
