module.exports = {
  config: {
    name: "ping",
    version: "2.0",
    author: "Arafat Da",
    countDown: 2,
    role: 0,
    description: "Check the bot's ping speed",
    category: "utility",
    guide: { en: "{pn}" }
  },

  onStart: async function ({ message, event }) {
    const timeStart = Date.now();
    const sentMessage = await message.reply("🏓 | Calculating ping...");
    const timeEnd = Date.now();
    const ping = timeEnd - timeStart;

    message.reply(`✅ | Pong!\n📶 Ping: ${ping}ms`);
  }
};
