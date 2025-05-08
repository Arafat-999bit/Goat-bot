module.exports = {
  config: {
    name: "leave",
    aliases: [],
    version: "1.0",
    author: "Arafat",
    countDown: 5,
    role: 1,
    shortDescription: {
      en: "Bot leaves the group"
    },
    longDescription: {
      en: "Force the bot to leave the current group chat"
    },
    category: "system",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ api, event }) {
    const threadID = event.threadID;
    const botID = api.getCurrentUserID();

    try {
      await api.removeUserFromGroup(botID, threadID);
    } catch (err) {
      return api.sendMessage("❌ Unable to leave the group. I might not have permission.", threadID);
    }
  }
};
