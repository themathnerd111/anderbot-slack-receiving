This is bot that will receive messages and post them into a Slack channel. It was built with the intention of receiving forwarded GroupMe messages to post them into Slack.

This readme assumes you are using Heroku.

## Slack Setup

You will need to add custom integrations to your Slack workspace.

- Bots
- Incoming Webhooks
- Outgoing Webhooks (if you would like to expand functionality of the bot later maybe)

When you create your bot, you will receive an API Token.

## Heroku Vars

You will need to update your Heroku config vars

- SLACK_API_TOKEN (you received this when creating your bot)
- CHANNEL_ID (the ID of the channel you want the bot to post in)

## TODOs

- Handle GroupMe event invites
- Handle GroupMe event RSVPS
- Handle GroupMe image posts

## Notes

MIT License
