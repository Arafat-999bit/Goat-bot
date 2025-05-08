const autoReactStatus = new Map();

module.exports = {
  config: {
    name: "autoreact",
    version: "3.0",
    author: "Arafat",
    countDown: 0,
    role: 0,
    shortDescription: {
      en: "Toggle auto emoji react"
    },
    longDescription: {
      en: "Turn on/off auto random emoji reaction in a thread"
    },
    category: "fun",
    guide: {
      en: "#autoreact on\n#autoreact off"
    }
  },

  onStart: async function ({ message, args, event }) {
    const threadID = event.threadID;
    const action = args[0]?.toLowerCase();

    if (action === "on") {
      autoReactStatus.set(threadID, true);
      return message.reply("✅ Auto React has been turned ON for this thread.");
    }

    if (action === "off") {
      autoReactStatus.set(threadID, false);
      return message.reply("❌ Auto React has been turned OFF for this thread.");
    }

    return message.reply("Please use: `#autoreact on` or `#autoreact off`");
  },

  onChat: async function ({ api, event }) {
    const threadID = event.threadID;
    const isEnabled = autoReactStatus.get(threadID);

    if (!isEnabled) return;

    const emojis = [
      "❤", "👍", "😆", "😮", "😢", "😠",
      "😂", "🤣", "😍", "😘", "😎", "🔥",
      "💯", "✨", "🥳", "🤯", "😇", "😈",
      "🙃", "😏", "💔", "🫶", "😳", "🤡", "🐸", "🪳", "🌸", "💀", "🥵", "😎", "🤪", "🥸", "🙍‍♀️", "🙆‍♀️", "👧", "🧛‍♀️", "🏃‍♀️", "😘", "🥰", "🥺" , "😭"
    ];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

    try {
      await api.setMessageReaction(randomEmoji, event.messageID, null, true);
    } catch (err) {
      console.error("React failed:", err);
    }
  }
};
