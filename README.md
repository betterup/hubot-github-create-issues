# Hubot Create Issues

A script to create github issues Hubot

## Installation

First, install [hubot-github-identity](https://github.com/tombell/hubot-github-identity).

Then In hubot project repo, run:

```
npm install hubot-github-create-issues --save
```

Then add **hubot-github-create-issues** to your `external-scripts.json`:

```javascript
["hubot-github-create-issues"]
```

## Hubot Commands

```
# create issue
hubot issues create myproject Something is going wrong

# create issue with labels
hubot issues create myproject Something is going wrong --label bug --label important
hubot issues create myproject Something is going wrong -l bug -l important

# create issue with issue body
hubot issues create myproject Something is going wrong --body more details here
```

## Configuration

The package uses https://github.com/tombell/hubot-github-identity to authenticate the user
* `HUBOT_GITHUB_USER` is the default owner of the repositories you'll target.
