const tools = require("../lib/tools.js");

exports.run = function(client, message, args, alias) {
  oldChannel = message.member.voiceChannel;
  newChannelId = "";
  newChannelName = args[0];

  //Check if no argument is passed
  if (typeof newChannelName == "undefined") {
    message.channel.send("Please provide a channelname.");
    return;
  }

  //Tried to find the channelID from the name
  for (var key in alias) {
    if (alias[key].includes(newChannelName)) {
      newChannelId = key;
      break;
    }
  }

  //Check if no key is found
  if (newChannelId == "") {
    message.channel.send("There is no such channel: *" + newChannelName + "*.");
    return;
  }

  //Check if the user is part of a voicechannel.
  if (typeof oldChannel === "undefined") {
    message.channel.send("You are not part of a voicechannel.");
    return;
  }

  //Check if it is the same channel.
  if (oldChannel.id == newChannelId) {
    message.channel.send("You are already in that channel.");
    return;
  }
  newChannel = message.guild.channels.find(val => val.id === newChannelId);
  //Check if the user have permission for the channel.
  if (!newChannel.memberPermissions(message.member).has("CONNECT")) {
    message.channel.send(
      "You do not have permission to move to channel: " + newChannel.name + "."
    );
    return;
  }

  counter = tools.moveMembers(client, message.member, newChannel);

  if (!counter) {
    message.channel.send("Channel " + newChannel.name + " is full");
    return;
  }

  message.channel.send(
    message.member.displayName + " moved to channel: *" + newChannel.name + "*."
  );
};

exports.help = {
  name: "join",
  detail:
    "Moved you from your current channel to another with ${PREFIX}join CHANNELNAME.",
  aliases: ["j"]
};
