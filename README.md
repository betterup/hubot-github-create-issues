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

## Hubot Commands

```
hubot issues create for [user/]repo Something is going wrong --labels bug --body issue description here
```

## Configuration

The package uses https://github.com/tombell/hubot-github-identity to authenticate the user
* `HUBOT_GITHUB_USER` is the default owner of the repositories you'll target.
