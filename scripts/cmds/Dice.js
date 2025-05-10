module.exports.config = {
  name: "dice",
  version: "2.0",
  hasPermission: 0,
  credits: "Arafat Da",
  description: "ডাইস গেম একা অথবা কাউকে চ্যালেঞ্জ করে খেলতে পারো",
  commandCategory: "game",
  usages: "[বেট] অথবা [বেট] @mention",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args, Currencies }) {
  const { threadID, messageID, senderID, mentions } = event;

  let bet = parseInt(args[0]);
  if (isNaN(bet) || bet <= 0) return api.sendMessage("❌ দয়া করে একটি বৈধ বেট এমাউন্ট দিন।", threadID, messageID);

  const senderData = await Currencies.getData(senderID);
  if (senderData.money < bet)
    return api.sendMessage("❌ তোমার কাছে এত টাকা নেই!", threadID, messageID);

  const mentionedID = Object.keys(mentions)[0];

  // Multiplayer Mode
  if (mentionedID) {
    if (mentionedID === senderID) return api.sendMessage("❌ তুমি নিজেকেই চ্যালেঞ্জ করতে পারো না!", threadID, messageID);

    const opponentData = await Currencies.getData(mentionedID);
    if (opponentData.money < bet)
      return api.sendMessage(`❌ ${mentions[mentionedID].replace("@", "")} এর কাছে যথেষ্ট টাকা নেই!`, threadID, messageID);

    return api.sendMessage(
      `${mentions[mentionedID]}!\n${senderData.name} তোমাকে ${bet}$ বেটে ডাইস খেলায় চ্যালেঞ্জ করেছে!\n\nডাইস খেলতে চাইলে রিপ্লাই করো: Y\nনা খেলতে চাইলে: N`,
      threadID,
      async (err, info) => {
        global.client.handleReply.push({
          name: this.config.name,
          messageID: info.messageID,
          author: mentionedID,
          challenger: senderID,
          bet: bet,
          type: "challenge"
        });
      }
    );
  }

  // Single Player Mode
  await Currencies.decreaseMoney(senderID, bet);

  const botDice = Math.floor(Math.random() * 6) + 1;
  const userDice = Math.floor(Math.random() * 6) + 1;

  let result = `🎲 তুমি পেয়েছো: ${userDice}\n🤖 বট পেয়েছে: ${botDice}\n`;

  if (userDice > botDice) {
    await Currencies.increaseMoney(senderID, bet * 2);
    result += `✅ তুমি জিতেছো! পেয়েছো ${bet * 2}$`;
  } else if (userDice < botDice) {
    result += `❌ তুমি হেরেছো! হারিয়েছো ${bet}$`;
  } else {
    await Currencies.increaseMoney(senderID, bet);
    result += `⚖️ টাই হয়েছে! তোমার টাকা ফেরত দেওয়া হয়েছে`;
  }

  return api.sendMessage(result, threadID, messageID);
};

module.exports.handleReply = async function ({ api, event, handleReply, Currencies }) {
  const { threadID, messageID, senderID, body } = event;

  if (handleReply.type === "challenge" && senderID === handleReply.author) {
    const bet = handleReply.bet;
    const challenger = handleReply.challenger;

    if (body.toLowerCase() === "y") {
      // চ্যালেঞ্জ এক্সেপ্ট করেছে
      await Currencies.decreaseMoney(challenger, bet);
      await Currencies.decreaseMoney(senderID, bet);

      const challengerDice = Math.floor(Math.random() * 6) + 1;
      const opponentDice = Math.floor(Math.random() * 6) + 1;

      let result = `🎮 ডাইস ম্যাচ শুরু!\n\n`;
      result += `👤 ${challenger} পেয়েছে: ${challengerDice}\n`;
      result += `👤 ${senderID} পেয়েছে: ${opponentDice}\n\n`;

      if (challengerDice > opponentDice) {
        await Currencies.increaseMoney(challenger, bet * 2);
        result += `✅ ${challenger} জিতেছে এবং পেয়েছে ${bet * 2}$`;
      } else if (challengerDice < opponentDice) {
        await Currencies.increaseMoney(senderID, bet * 2);
        result += `✅ ${senderID} জিতেছে এবং পেয়েছে ${bet * 2}$`;
      } else {
        await Currencies.increaseMoney(challenger, bet);
        await Currencies.increaseMoney(senderID, bet);
        result += `⚖️ ম্যাচ ড্র! দুই পক্ষের টাকা ফেরত`;
      }

      return api.sendMessage(result, threadID);
    } else if (body.toLowerCase() === "n") {
      return api.sendMessage("❌ তুমি ডাইস খেলায় অংশগ্রহণ করোনি।", threadID);
    } else {
      return api.sendMessage("❓ দয়া করে শুধুমাত্র Y বা N রিপ্লাই করো।", threadID);
    }
  }
};
