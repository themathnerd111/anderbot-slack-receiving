console.log("loaded bot.js");

const
	slack        = require('@slack/client'),
	slack_events = slack.CLIENT_EVENTS.RTM,
	rtm_events   = slack.RTM_EVENTS,
	channelID		 = process.env.CHANNEL_ID,
	botUserID    = "" // not in use
	;

var RTM; // holds rtm object created in slackBot()
var HTTPS = require('https');
var request = require('request');

/*
	method used to create new instance of the bot
*/

var slackBot = function() {
	if (!(this instanceof slackBot))
		return new slackBot();

	var that = this;

	this.web = new slack.WebClient(process.env.SLACK_API_TOKEN);
	this.rtm = new slack.RtmClient(process.env.SLACK_API_TOKEN, {logLevel: 'warn'});
	RTM = this.rtm;
	this.rtm.on(rtm_events.MESSAGE, function(data) {
		console.log('new msg detected');
		// that.listening(data); // NOTE: for debug purposes, the bot shouldnt listen in prod
	});
	this.rtm.on('error', function(infraction) { console.log(infraction); });


};

/*
	start the bot
*/
slackBot.prototype.initializeBot = function() {
	this.rtm.start();
	this.rtm.on(slack_events.RTM_CONNECTION_OPENED, function slackClientOpened()
	{
		console.log('slackbot running');
	});
};

/*
	forward messages received to the slack channe
*/
slackBot.prototype.forwardMessage = function() {
	console.log('forwardMessage function called');
	var request = JSON.parse(this.req.chunks[0]);

	console.log('received request ', JSON.stringify(request));

  this.res.writeHead(200);
	if(request.sender_id == 'system') {
		console.log("ignoring bot message");
		} else {
			if (request.attachments.length === 0) { // if no attachments
				RTM.sendMessage('*GroupMe: ' + request.name + ":* " + request.text, channelID);
			} else { // if images, post URLs
				for (var i = 0; i < request.attachments.length; i++) {
					if(request.attachments[i].type == 'image') {
						RTM.sendMessage('*GroupMe: ' + request.name + ":* " + request.attachments[i].url, channelID);
					}
					if(request.attachments[i].type == 'mentions') {
						RTM.sendMessage('*GroupMe: ' + request.name + ":* " + request.text, channelID);
					}
				}
			}
		}
  this.res.end();
};

/*
	debug functionality. this is how the bot would respond to messages in the slack channel
	and can be called by the slackbot method. if this is used, must update the botUserId in
	the environmental vars / heroku config vars to prevent the bot from copying its own
	messages
*/

slackBot.prototype.listening = function(data) {
	console.log('listening, heard ', data);
	if (data.user === botUserID || data.subtype === 'bot_message') {
		console.log('ignoring bot message');
		return;
	}
	this.speak(data);
};

/*
	debug functionality to test the bot, this is not called by the slackbot method
	this is how the bot would post to the slack channel
*/
slackBot.prototype.speak = function(data) {
		console.log('speaking', data.text, ' ', data);
		RTM.sendMessage('echoing ' + JSON.stringify(data), data.channel);
};

var assert = require('assert');
assert(process.env.SLACK_API_TOKEN, 'YOU MUST PROVIDE A SLACK API TOKEN IN THE ENVIRONMENT VARIABLE SLACK_API_TOKEN.');

/*
	create a new instance of the bot and export it
*/
var newBot = new slackBot();
newBot.initializeBot();
module.exports = newBot;
