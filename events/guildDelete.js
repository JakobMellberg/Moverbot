module.exports = (client, guild) => {
  msg = {
    author: { username: guild.name, id: guild.id },
    content: "Left guild: " + guild.name + " with id: " + guild.id,
    guild: { id: guild.id },
  };
  response = {
    success: true,
    message: msg.content,
  };

  client.lib.log(client, msg, response, true);
};
