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
        auth_url = process.env.HUBUT_HOSTNAME + "/github/identity";
        res.reply("Sorry, you haven't told me your GitHub username.  Enter your Github API token at " + auth_url + " and then tell me who you are\n\n> " + robot.name + " I am GITHUB_USERNAME");
    }
  };

  // @param input string or array of strings
  // @return array of compacted and trimmed strings
  parseLabels = function(input) {
    var labels = [];
    if (input.constructor === Array) {
      labels = input;
    } else {
      labels = [input];
    }
    return labels.map(function (s) { return s.trim(); } );
  };

  // parse message input into github issue payload
  parseIssue = function(message) {
    var args = parse(message);
    var parseOpts = {
      options: [
        '-l',
        '--label'
      ],
      alias: {
        '-l': 'label'
      }
    };
    var result = parseArgs(args, parseOpts);
    var options = result.options;
    console.log(result, options);
    var payload = {};
    payload.title = result.unparsed.join(' ');
    payload.milestone = options.milestone;
    payload.body = options.body;
    if (options.label) {
      payload.labels = parseLabels(options.label);
    }
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
          res.reply("I've opened issue " + repo + '#' + issue.number + " for you\n" + issue.html_url);
        });
      }
    });
  });
};
