const fs = require("fs");

module.exports = {
  config: {
    name: "dice",
    version: "2.0",
    hasPermission: 0,
    credits: "Arafat",
    description: "ডাইস গেম একা অথবা কাউকে চ্যালেঞ্জ করে খেলতে পারো",
    category: "game",
    usages: "[amount] অথবা [amount] @mention",
    cooldowns: 5
  },

  onStart: async function ({ api, event, args, usersData, Currencies }) {
    const { threadID, senderID, messageID, mentions } = event;
    const bet = parseInt(args[0]);

    if (!bet || isNaN(bet) || bet <= 0) return api.sendMessage("❌ দয়া করে একটি সঠিক বেট অ্যামাউন্ট দাও।", threadID, messageID);

    const userBalance = (await Currencies.getData(senderID)).money;
    if (userBalance < bet) return api.sendMessage("❌ তোমার কাছে এত টাকা নেই।", threadID, messageID);

    // Multiplayer Mode
    if (Object.keys(mentions).length > 0) {
      const opponentID = Object.keys(mentions)[0];
      const opponentName = mentions[opponentID].replace("@", "");

      if (opponentID == senderID) return api.sendMessage("❌ নিজেকে চ্যালেঞ্জ দিতে পারো না!", threadID, messageID);

      const opponentBalance = (await Currencies.getData(opponentID)).money;
      if (opponentBalance < bet) return api.sendMessage(`❌ ${opponentName} এর কাছে এত টাকা নেই।`, threadID, messageID);

      api.sendMessage(
        `${opponentName}, তুমি কি ${bet}$ বেটে ডাইস খেলতে চাও ${await usersData.getName(senderID)} এর সাথে?\n\n` +
        `রাজি থাকলে রিপ্লাই করো 'Y' আর না চাইলে 'N'`,
        threadID,
        (err, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: "dice",
            messageID: info.messageID,
            author: senderID,
            opponentID,
            bet
          });
        }
      );
    }

    // Single Player Mode
    else {
      const userDice = Math.floor(Math.random() * 6) + 1;
      const botDice = Math.floor(Math.random() * 6) + 1;

      let result = `তুমি 🎲: ${userDice}\nবট 🎲: ${botDice}\n\n`;
      if (userDice > botDice) {
        await Currencies.increaseMoney(senderID, bet);
        result += `✅ তুমি জিতেছো ${bet}$!`;
      } else if (userDice < botDice) {
        await Currencies.decreaseMoney(senderID, bet);
        result += `❌ তুমি হারছো ${bet}$।`;
      } else {
        result += "🤝 টাই হয়েছে! কারও লাভ বা ক্ষতি হয়নি।";
      }

      return api.sendMessage(result, threadID, messageID);
    }
  },

  onReply: async function ({ event, api, Currencies, usersData, Reply }) {
    const { senderID, threadID, messageID, body } = event;
    const { author, opponentID, bet } = Reply;

    if (senderID != opponentID) return;

    if (body.toLowerCase() == "y") {
      const authorBalance = (await Currencies.getData(author)).money;
      const opponentBalance = (await Currencies.getData(opponentID)).money;

      if (authorBalance < bet || opponentBalance < bet) {
        return api.sendMessage("❌ দুজনের একাউন্টেই যথেষ্ট টাকা নেই।", threadID, messageID);
      }

      const authorDice = Math.floor(Math.random() * 6) + 1;
      const opponentDice = Math.floor(Math.random() * 6) + 1;

      let result = `ডাইস রোল হচ্ছে...\n\n` +
        `${await usersData.getName(author)} 🎲: ${authorDice}\n` +
        `${await usersData.getName(opponentID)} 🎲: ${opponentDice}\n\n`;

      if (authorDice > opponentDice) {
        await Currencies.decreaseMoney(opponentID, bet);
        await Currencies.increaseMoney(author, bet);
        result += `✅ ${await usersData.getName(author)} জিতেছে ${bet}$`;
      } else if (authorDice < opponentDice) {
        await Currencies.decreaseMoney(author, bet);
        await Currencies.increaseMoney(opponentID, bet);
        result += `✅ ${await usersData.getName(opponentID)} জিতেছে ${bet}$`;
      } else {
        result += "🤝 টাই হয়েছে! কারও লাভ বা ক্ষতি হয়নি।";
      }

      return api.sendMessage(result, threadID);
    }

    if (body.toLowerCase() == "n") {
      return api.sendMessage("❌ চ্যালেঞ্জ বাতিল হয়েছে।", threadID, messageID);
    }
  }
};
