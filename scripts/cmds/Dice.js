module.exports = {
  config: {
    name: "dice",
    aliases: [],
    version: "1.0",
    author: "Arafat",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Roll a dice to win or lose money"
    },
    longDescription: {
      en: "Roll a dice and bet your money. If you win, you get double!"
    },
    category: "fun",
    guide: {
      en: "{pn} <amount>"
    }
  },

  onStart: async function ({ api, event, args, message }) {
    const { threadID, senderID, messageID } = event;
    const bet = parseInt(args[0]);
    const usersData = global.controllers?.usersData;
    const economy = global.controllers?.economy;

    if (!usersData || !economy)
      return message.reply("❌ ইউজার বা ইকোনমি ডাটা লোড হয়নি।");

    if (isNaN(bet) || bet <= 0)
      return message.reply("⚠️ একটি সঠিক টাকার পরিমাণ লেখো। যেমন: #dice 100");

    const balance = await economy.get(senderID);
    if (balance < bet)
      return message.reply("❌ তোমার কাছে যথেষ্ট টাকা নেই।");

    // Dice rolls
    const userRoll = Math.floor(Math.random() * 6) + 1;
    const botRoll = Math.floor(Math.random() * 6) + 1;

    let resultMsg = `🎲 তুমি ${userRoll} পেলা, আমি পেলাম ${botRoll}!\n`;

    if (userRoll > botRoll) {
      await economy.add(senderID, bet);
      resultMsg += `✅ তুমি জিতেছো! তুমি ${bet} টাকা পেলে।`;
    } else if (userRoll < botRoll) {
      await economy.add(senderID, -bet);
      resultMsg += `❌ তুমি হারলে! ${bet} টাকা কেটে নেওয়া হলো।`;
    } else {
      resultMsg += "⚖️ ড্র! টাকার কোনো পরিবর্তন হয়নি।";
    }

    return message.reply(resultMsg);
  }
};
