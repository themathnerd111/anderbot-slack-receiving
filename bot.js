#!/usr/bin/env node
console.log("loaded bot.js");

const
	lru					 = require('lru-cache'),
	slack        = require('@slack/client'),
	slack_events = slack.CLIENT_EVENTS.RTM,
	rtm_events   = slack.RTM_EVENTS
	;

var RTM; // holds rtm object created in slackBot()
var HTTPS = require('https');
var request = require('request');



var slackBot = function() {
	if (!(this instanceof slackBot))
		return new slackBot();

	var that = this;

	this.cache = lru({ max: 2000, });
	this.web = new slack.WebClient(process.env.SLACK_API_TOKEN);
	this.rtm = new slack.RtmClient(process.env.SLACK_API_TOKEN, {logLevel: 'warn'});
	RTM = this.rtm;
	this.rtm.on(rtm_events.MESSAGE, function(data) {
		console.log('new msg detected');
		// slackBot.prototype.listening(data);
		that.listening(data)
	});
	this.rtm.on('error', function(infraction) { console.log(infraction); });


};

slackBot.prototype.initializeBot = function() {
	this.rtm.start();
	this.rtm.on(slack_events.RTM_CONNECTION_OPENED, function slackClientOpened()
	{
		console.log('slackbot running');
	});
};

slackBot.prototype.forwardMessage = function() {
	console.log('forwardMessage function called');
	var request = JSON.parse(this.req.chunks[0]);

	console.log('received request ', JSON.stringify(request));

  this.res.writeHead(200);
  // this.speak(JSON.stringify(request));
	RTM.sendMessage('FWD: ' + request.name + ": " + request.text, "C7C446JDV");
  this.res.end();
}


slackBot.prototype.listening = function(data) {
	console.log('listening, heard ', data);
	if (data.user === 'U7AG45HU1' || data.subtype === 'bot_message') {
		console.log('ignoring bot message');
		return;
	}
	this.speak(data)
};

slackBot.prototype.speak = function(data) {
		// console.log('speaking', data.text, ' ', data);
		// RTM.sendMessage('echoing ' + JSON.stringify(data), data.channel);
};

/*
if (require.main === module) {
	console.log("detecting whether to start bot")
	require('dotenv').config({silent: true});
	var assert = require('assert');
	assert(process.env.SLACK_API_TOKEN, 'YOU MUST PROVIDE A SLACK API TOKEN IN THE ENVIRONMENT VARIABLE SLACK_API_TOKEN.');

	var newBot = new slackBot();
	newBot.initializeBot();
} else (
	console.log("not starting bot")
)
*/

require('dotenv').config({silent: true});
var assert = require('assert');
assert(process.env.SLACK_API_TOKEN, 'YOU MUST PROVIDE A SLACK API TOKEN IN THE ENVIRONMENT VARIABLE SLACK_API_TOKEN.');

var newBot = new slackBot();
newBot.initializeBot();
module.exports = newBot;
