module.exports.config = { name: "dice", version: "2.0", hasPermission: 0, credits: "Arafat Da", description: "Play a dice betting game", commandCategory: "economy", usages: "#dice [amount] | #dice @user [amount] | #dice leaderboard/list/top", cooldowns: 5 };

const fs = require("fs"); const path = __dirname + "/cache/dice.json";

let leaderboard = fs.existsSync(path) ? JSON.parse(fs.readFileSync(path)) : {};

function saveLeaderboard() { fs.writeFileSync(path, JSON.stringify(leaderboard, null, 2)); }

module.exports.run = async function ({ api, event, args, Currencies }) { const { threadID, senderID, messageID, mentions } = event;

if (!leaderboard[senderID]) leaderboard[senderID] = { wins: 0, losses: 0 };

// Leaderboard command if (["leaderboard", "list", "top"].includes(args[0])) { const sorted = Object.entries(leaderboard) .sort((a, b) => b[1].wins - a[1].wins) .slice(0, 10);

let msg = "=== Dice Leaderboard ===\n";
for (let i = 0; i < sorted.length; i++) {
  const [uid, stats] = sorted[i];
  const name = (await api.getUserInfo(uid))[uid]?.name || "Unknown";
  msg += `\n${i + 1}. ${name} - ${stats.wins} Wins | ${stats.losses} Losses`;
}
return api.sendMessage(msg, threadID, messageID);

}

let bet = parseInt(args[0]); if (!isNaN(bet)) { const userBalance = (await Currencies.getData(senderID)).money; if (bet <= 0 || userBalance < bet) return api.sendMessage("❌ তোমার কাছে এত টাকা নেই বা ইনপুট ভুল।", threadID, messageID);

const botRoll = Math.floor(Math.random() * 6) + 1;
const userRoll = Math.floor(Math.random() * 6) + 1;

let result = `🎲 তুমি ${userRoll} পেয়েছো

🤖 বট পেয়েছে ${botRoll}\n`;

if (userRoll > botRoll) {
  await Currencies.increaseMoney(senderID, bet);
  leaderboard[senderID].wins++;
  result += `✅ তুমি ${bet} টাকা জিতেছো!`;
} else if (userRoll < botRoll) {
  await Currencies.decreaseMoney(senderID, bet);
  leaderboard[senderID].losses++;
  result += `❌ তুমি ${bet} টাকা হেরেছো!`;
} else {
  result += "⚖️ খেলাটা ড্র হয়েছে! কোনো টাকা কাটা হয়নি।";
}

saveLeaderboard();
return api.sendMessage(result, threadID, messageID);

}

// PvP dice match const mentionID = Object.keys(mentions)[0]; const mentionName = mentions[mentionID]; const pvpBet = parseInt(args[1]);

if (mentionID && !isNaN(pvpBet)) { const userBal1 = (await Currencies.getData(senderID)).money; const userBal2 = (await Currencies.getData(mentionID)).money;

if (userBal1 < pvpBet || userBal2 < pvpBet)
  return api.sendMessage("❌ দুইজনের কাছেই পর্যাপ্ত টাকা থাকতে হবে।", threadID, messageID);

global.dicePvP = global.dicePvP || {};
global.dicePvP[threadID] = {
  challenger: senderID,
  opponent: mentionID,
  bet: pvpBet,
  messageID: null
};

return api.sendMessage({
  body: `${event.senderID} ${mentionName}, তোমাকে ${pvpBet} টাকার ডাইস খেলার চ্যালেঞ্জ করেছে।

রাজি থাকলে "Y" এবং না থাকলে "N" রিপ্লাই করো।`, mentions: [{ id: mentionID, tag: mentionName }] }, threadID, (err, info) => global.dicePvP[threadID].messageID = info.messageID); }

// PvP response handler if (global.dicePvP && global.dicePvP[threadID]) { const pvp = global.dicePvP[threadID]; if (event.messageID === pvp.messageID && senderID === pvp.opponent) { if (event.body.toLowerCase() === "y") { const roll1 = Math.floor(Math.random() * 6) + 1; const roll2 = Math.floor(Math.random() * 6) + 1; let result = 🎲 ${pvp.challenger} পেয়েছে ${roll1} 🎲 ${pvp.opponent} পেয়েছে ${roll2}\n;

if (roll1 > roll2) {
      await Currencies.increaseMoney(pvp.challenger, pvp.bet);
      await Currencies.decreaseMoney(pvp.opponent, pvp.bet);
      leaderboard[pvp.challenger].wins++;
      leaderboard[pvp.opponent].losses++;
      result += `✅ ${pvp.challenger} জিতে গেছে ${pvp.bet * 2} টাকা!`;
    } else if (roll1 < roll2) {
      await Currencies.increaseMoney(pvp.opponent, pvp.bet);
      await Currencies.decreaseMoney(pvp.challenger, pvp.bet);
      leaderboard[pvp.opponent].wins++;
      leaderboard[pvp.challenger].losses++;
      result += `✅ ${pvp.opponent} জিতে গেছে ${pvp.bet * 2} টাকা!`;
    } else {
      result += "⚖️ ম্যাচটি ড্র হয়েছে, কারো টাকা কাটেনি।";
    }

    saveLeaderboard();
    delete global.dicePvP[threadID];
    return api.sendMessage(result, threadID);
  } else if (event.body.toLowerCase() === "n") {
    delete global.dicePvP[threadID];
    return api.sendMessage("❌ চ্যালেঞ্জ বাতিল হয়েছে।", threadID);
  }
}

}

return api.sendMessage("❌ ভুল ফরম্যাট!\nসঠিকভাবে ব্যবহার করো:\n#dice [amount]\n#dice @user [amount]\n#dice leaderboard | list | top", threadID, messageID); };

