module.exports = {
  config: {
    name: "dice",
    aliases: [],
    version: "1.0",
    author: "Arafat",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Play a simple dice game"
    },
    longDescription: {
      en: "Roll a dice with a bet and see if you win or lose."
    },
    category: "fun",
    guide: {
      en: "{pn} <bet>"
    }
  },

  onStart: async function ({ api, event, args, message }) {
    const { threadID, senderID, messageID } = event;

    // Read the bet amount
    let bet = parseInt(args[0]);
    
    // Check if bet is a valid number
    if (isNaN(bet) || bet <= 0) {
      return message.reply("⚠️ বাজির পরিমাণ সঠিকভাবে দিন। উদাহরণ: #dice 100");
    }

    // Simulate dice roll (1 to 6)
    const playerRoll = Math.floor(Math.random() * 6) + 1;
    const botRoll = Math.floor(Math.random() * 6) + 1;

    // Prepare result message
    let resultMessage = `🎲 তুমি পেলে ${playerRoll}, আমি পেলাম ${botRoll}!\n`;

    if (playerRoll > botRoll) {
      resultMessage += `✅ তুমি জিতেছো! তুমি ${bet} টাকা পাবে।`;
    } else if (playerRoll < botRoll) {
      resultMessage += `❌ তুমি হারলে! ${bet} টাকা কেটে নেওয়া হলো।`;
    } else {
      resultMessage += "⚖️ ড্র! টাকার কোনো পরিবর্তন হয়নি।";
    }

    return message.reply(resultMessage);
  }
};
