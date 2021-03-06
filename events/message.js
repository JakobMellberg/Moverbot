//Waiting for messages
module.exports = async (client, message) => {
  /////////////////////////////////
  //         Permissions         //
  /////////////////////////////////
  //Only accept text channel.
  if (message.channel.type != "text") return;

  //Load async config from the mongoDB.
  config = await client.lib.db.loadConfig(client, message.guild);
  alias = config.alias;
  client.guild = {};
  client.guild.config = config;

  //Dont read bot messages. Only if enabled
  if (message.author.bot && !client.guild.config.botMessages) return;

  //Ignores all messages without the prefix
  if (!message.content.startsWith(client.guild.config.prefix)) return;
  //Only accept right channel that the bot works in
  if (
    message.channel.id != client.guild.config.channel &&
    message.channel.name != "moverbot"
  )
    return;

  //If message is only prefix = do nothing
  if (message.content == client.guild.config.prefix) {
    message.channel.send("Please enter a command");
    return;
  }

  var args = message.content
    .slice(client.guild.config.prefix.length)
    .trim()
    .split(" ");
  var command = args.shift();

  var newargs = [];

  //args cleanup
  for (var i = 0; i < args.length; i++) {
    if (args[i].startsWith('"')) {
      newargs[i] = args[i].slice(1); //slice removes "
      if (!args[i].endsWith('"')) {
        j = i + 1;
        while (j < args.length) {
          newargs[i] = newargs[i] + " " + args[j];
          if (args[j].endsWith('"')) {
            newargs[i] = newargs[i].slice(0, -1);
            break;
          }
          j++;
        }
        i = j;
      } else {
        newargs[i] = newargs[i].slice(0, -1);
      }
    } else {
      newargs[i] = args[i];
    }
  }
  //Returning to original args remove null elements
  args = newargs.filter(function (el) {
    return el != null;
  });

  //Check if !alias
  for (var key in alias) {
    if (alias[key].includes(command)) {
      args.unshift(command); //Including back alias arg
      command = client.guild.config.aliasCommand;
      break;
    }
  }
  client.cmd = null;
  client.cmd = client.commands.get(command.toLowerCase());

  if (!client.cmd) {
    client.cmd = { help: { name: command } };
    response = client.lib.message.send(
      client,
      message.channel,
      "CANNOT_HANDLE_COMMAND"
    );
  } else {
    response = client.cmd.run(client, message, args);
  }
  //Logging every command
  client.lib.log(client, message, await response);
};
