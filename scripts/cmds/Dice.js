module.exports = {
  config: {
    name: "dice",
    version: "2.0",
    hasPermission: 0,
    credits: "Arafat",
    description: "ডাইস গেম, একা বা কাউকে চ্যালেঞ্জ করে খেলো",
    category: "game",
    usages: "[amount] অথবা [amount] @mention",
    cooldowns: 5
  },

  onStart: async function ({ api, event, args, usersData, economy }) {
    const { threadID, senderID, messageID, mentions } = event;
    const bet = parseInt(args[0]);
    if (!bet || isNaN(bet) || bet <= 0) return api.sendMessage("❌ সঠিক বেট অ্যামাউন্ট দাও।", threadID, messageID);

    const userMoney = await economy.get(senderID);
    if (userMoney < bet) return api.sendMessage("❌ তোমার কাছে যথেষ্ট টাকা নেই।", threadID, messageID);

    if (Object.keys(mentions).length > 0) {
      const opponentID = Object.keys(mentions)[0];
      const opponentName = mentions[opponentID].replace("@", "");

      if (opponentID == senderID) return api.sendMessage("❌ নিজেকে চ্যালেঞ্জ দিতে পারো না!", threadID, messageID);

      const oppMoney = await economy.get(opponentID);
      if (oppMoney < bet) return api.sendMessage(`❌ ${opponentName} এর কাছে যথেষ্ট টাকা নেই।`, threadID, messageID);

      api.sendMessage(
        `${opponentName}, তুমি কি ${bet}$ বেটে ডাইস খেলতে চাও ${await usersData.getName(senderID)} এর সাথে?\n\n` +
        `রাজি থাকলে রিপ্লাই করো 'Y', না চাইলে 'N' লিখো।`,
        threadID,
        (err, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: "dice",
            author: senderID,
            opponentID,
            bet
          });
        }
      );
    } else {
      const userDice = Math.floor(Math.random() * 6) + 1;
      const botDice = Math.floor(Math.random() * 6) + 1;

      let result = `তুমি 🎲: ${userDice}\nবট 🎲: ${botDice}\n\n`;
      if (userDice > botDice) {
        await economy.add(senderID, bet);
        result += `✅ তুমি জিতেছো ${bet}$!`;
      } else if (userDice < botDice) {
        await economy.add(senderID, -bet);
        result += `❌ তুমি হারছো ${bet}$।`;
      } else {
        result += "🤝 টাই! কোনো লাভ বা ক্ষতি হয়নি।";
      }

      return api.sendMessage(result, threadID, messageID);
    }
  },

  onReply: async function ({ api, event, usersData, economy, Reply }) {
    const { senderID, threadID, messageID, body } = event;
    const { author, opponentID, bet } = Reply;

    if (senderID != opponentID) return;

    if (body.toLowerCase() == "y") {
      const authorMoney = await economy.get(author);
      const oppMoney = await economy.get(opponentID);
      if (authorMoney < bet || oppMoney < bet)
        return api.sendMessage("❌ দুইজনেরই পর্যাপ্ত টাকা থাকতে হবে!", threadID, messageID);

      const authorDice = Math.floor(Math.random() * 6) + 1;
      const oppDice = Math.floor(Math.random() * 6) + 1;

      let result = `ডাইস রোল হচ্ছে...\n\n` +
        `${await usersData.getName(author)} 🎲: ${authorDice}\n` +
        `${await usersData.getName(opponentID)} 🎲: ${oppDice}\n\n`;

      if (authorDice > oppDice) {
        await economy.add(author, bet);
        await economy.add(opponentID, -bet);
        result += `✅ ${await usersData.getName(author)} জিতেছে ${bet}$`;
      } else if (authorDice < oppDice) {
        await economy.add(author, -bet);
        await economy.add(opponentID, bet);
        result += `✅ ${await usersData.getName(opponentID)} জিতেছে ${bet}$`;
      } else {
        result += "🤝 টাই! কেউ হারেনি।";
      }

      return api.sendMessage(result, threadID);
    }

    if (body.toLowerCase() == "n") {
      return api.sendMessage("❌ চ্যালেঞ্জ বাতিল হয়েছে।", threadID, messageID);
    }
  }
};
