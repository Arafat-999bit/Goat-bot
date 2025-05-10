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

    // Load economy controller properly
    const economy = global.controllers?.economy;
    const usersData = global.controllers?.usersData;

    // Check if economy or usersData are not available
    if (!economy || !usersData) {
      return message.reply("❌ ইউজার বা ইকোনমি ডাটা সঠিকভাবে লোড হয়নি।");
    }

    if (isNaN(bet) || bet <= 0)
      return message.reply("⚠️ একটি সঠিক টাকার পরিমাণ লেখো। যেমন: #dice 100");

    try {
      // Fetch the user's balance
      const userBalance = await economy.get(senderID);
      if (userBalance < bet)
        return message.reply("❌ তোমার কাছে যথেষ্ট টাকা নেই।");

      // Dice rolls
      const userRoll = Math.floor(Math.random() * 6) + 1;
      const botRoll = Math.floor(Math.random() * 6) + 1;

      let resultMsg = `🎲 তুমি ${userRoll} পেলা, আমি পেলাম ${botRoll}!\n`;

      if (userRoll > botRoll) {
        await economy.add(senderID, bet); // Adding the bet to the user if win
        resultMsg += `✅ তুমি জিতেছো! তুমি ${bet} টাকা পেলে।`;
      } else if (userRoll < botRoll) {
        await economy.add(senderID, -bet); // Deducting the bet if user loses
        resultMsg += `❌ তুমি হারলে! ${bet} টাকা কেটে নেওয়া হলো।`;
      } else {
        resultMsg += "⚖️ ড্র! টাকার কোনো পরিবর্তন হয়নি।";
      }

      return message.reply(resultMsg);
    } catch (error) {
      console.error("Error occurred:", error);
      return message.reply("❌ কিছু সমস্যা হয়েছে। আবার চেষ্টা করো।");
    }
  }
};
