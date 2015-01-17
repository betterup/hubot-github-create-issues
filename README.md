# Hubot Create Issues

A script to create github issues Hubot

## Installation

In hubot project repo, run:

```
npm install hubot-github-create-issues --save
```

Then add **hubot-github-create-issues** to your `external-scripts.json`:

```javascript
["hubot-github-create-issues"]
```

## Configuration

You can use either

* The package use https://github.com/tombell/hubot-github-identity to authenticate the user
* `HUBOT_GITHUB_TOKEN` environment variable to authenticate with github

`HUBOT_GITHUB_USER` is the default owner of the repositories you'll target.

### Acquire a token

If you don't have a token yet, run this:

```
curl -i https://api.github.com/authorizations -d '{"note":"githubot","scopes":["repo"]}' -u "yourusername"
```

Enter your Github password when prompted. When you get a response, look for the "token" value.

## Hubot Commands

```
hubot issues create for [user/]repo #label1,#label2 Something is going wrong - Some details
```
