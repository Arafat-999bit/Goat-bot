// Dice Game with PvP Challenge, Single Player, and Leaderboard const { getStreamFromURL } = global.utils;

let challenges = {}; let leaderboard = {};

module.exports = { config: { name: "dice", version: "4.0", author: "Arafat Da", countDown: 5, role: 0, shortDescription: "ডাইস গেম - PvP, সিঙ্গেল প্লেয়ার ও লিডারবোর্ড", longDescription: "ডাইস গেম: মেনশন করে PvP খেলা + সিঙ্গেল প্লেয়ার মোড + বেটিং সিস্টেম + লিডারবোর্ড", category: "game", guide: { en: "{pn} [amount] (@opponent)\n{pn} leaderboard" } },

onStart: async function ({ message, event, args, usersData, economy, commandName }) { const senderID = event.senderID; const mentionIDs = Object.keys(event.mentions || {});

if (['leaderboard', 'list', 'top'].includes(args[0])) {
  let board = Object.entries(leaderboard)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(async ([id, score], i) => {
      const name = await usersData.getName(id);
      return `${i + 1}. ${name}: ${score} জয়`;
    });
  const resolved = await Promise.all(board);
  return message.reply("🏆 ডাইস লিডারবোর্ড:\n\n" + resolved.join("\n"));
}

const bet = parseInt(args[0]);
if (!bet || isNaN(bet) || bet <= 0)
  return message.reply("সঠিকভাবে বেট লিখো! উদাহরণ: #dice 100 অথবা #dice 100 @রাকিব");

if (mentionIDs.length === 0) {
  // Single player mode
  const balance = await economy.getMoney(senderID);
  if (balance < bet) return message.reply(`তোমার কাছে ${bet} কয়েন নেই!`);

  await economy.updateMoney(senderID, -bet);
  const roll = Math.floor(Math.random() * 6) + 1;
  const win = roll >= 4;

  if (win) {
    await economy.updateMoney(senderID, bet * 2);
    leaderboard[senderID] = (leaderboard[senderID] || 0) + 1;
    return message.reply(`🎲 তুমি পেলা ${roll}! তুমি জিতেছো এবং পেয়েছো ${bet * 2} কয়েন!`);
  } else {
    return message.reply(`🎲 তুমি পেলা ${roll}! তুমি হেরে গেছো এবং হারিয়েছো ${bet} কয়েন!`);
  }
}

// PvP mode
const opponentID = mentionIDs[0];
if (opponentID === senderID) return message.reply("তুমি নিজেই নিজের সাথে খেলতে পারো না!");

const senderMoney = await economy.getMoney(senderID);
const opponentMoney = await economy.getMoney(opponentID);

if (senderMoney < bet) return message.reply(`তোমার কাছে পর্যাপ্ত (${bet}) কয়েন নেই!`);
if (opponentMoney < bet) return message.reply(`প্রতিদ্বন্দ্বীর কাছে পর্যাপ্ত (${bet}) কয়েন নেই!`);

const senderName = await usersData.getName(senderID);
const opponentName = await usersData.getName(opponentID);

challenges[opponentID] = {
  challengerID: senderID,
  bet: bet,
  timestamp: Date.now()
};

return message.reply({
  body: `${opponentName}, তুমি কি ${senderName}-এর সাথে ডাইস খেলতে রাজি?\n\nবেট: ${bet} কয়েন\n\n**রাজি থাকলে রিপ্লাই করো: Y**\n**না থাকলে রিপ্লাই করো: N**`,
  mentions: [{ tag: opponentName, id: opponentID }]
});

},

onReply: async function ({ message, event, reply, usersData, economy }) { const replyUser = event.senderID; const content = event.body.toLowerCase();

const challenge = challenges[replyUser];
if (!challenge) return;

const { challengerID, bet } = challenge;
const challengerName = await usersData.getName(challengerID);
const opponentName = await usersData.getName(replyUser);

if (content === "n") {
  delete challenges[replyUser];
  return message.reply(`${opponentName} চ্যালেঞ্জ গ্রহণ করেনি। খেলা বাতিল হয়েছে।`);
}

if (content !== "y") return;

const challengerMoney = await economy.getMoney(challengerID);
const opponentMoney = await economy.getMoney(replyUser);

if (challengerMoney < bet || opponentMoney < bet) {
  delete challenges[replyUser];
  return message.reply(`কোনো একজনের কাছে পর্যাপ্ত কয়েন নেই। খেলা বাতিল।`);
}

await economy.updateMoney(challengerID, -bet);
await economy.updateMoney(replyUser, -bet);

const roll1 = Math.floor(Math.random() * 6) + 1;
const roll2 = Math.floor(Math.random() * 6) + 1;
const dice = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

let result;
if (roll1 > roll2) {
  await economy.updateMoney(challengerID, bet * 2);
  leaderboard[challengerID] = (leaderboard[challengerID] || 0) + 1;
  result = `${challengerName} জিতেছে এবং পেয়েছে ${bet * 2} কয়েন!`;
} else if (roll2 > roll1) {
  await economy.updateMoney(replyUser, bet * 2);
  leaderboard[replyUser] = (leaderboard[replyUser] || 0) + 1;
  result = `${opponentName} জিতেছে এবং পেয়েছে ${bet * 2} কয়েন!`;
} else {
  await economy.updateMoney(challengerID, bet);
  await economy.updateMoney(replyUser, bet);
  result = "খেলা ড্র হয়েছে! দুইজনকেই টাকা ফেরত দেয়া হয়েছে।";
}

delete challenges[replyUser];

return message.reply(
  `🎲 **ডাইস চ্যালেঞ্জ** 🎲\n\n` +
  `${challengerName}: ${dice[roll1 - 1]} (${roll1})\n` +
  `${opponentName}: ${dice[roll2 - 1]} (${roll2})\n\n` +
  result
);

} };

