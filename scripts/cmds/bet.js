module.exports = {
  config: {
    name: "bet",
    version: "2.0",
    author: "𝗦𝗵𝗔𝗻 + Arafat Da",
    shortDescription: { en: "Advanced bet game" },
    longDescription: { en: "Try your luck and win big!" },
    category: "𝗚𝗔𝗠𝗘",
  },

  langs: {
    en: {
      invalid_amount: "Enter a valid and positive amount to have a chance to win double!",
      not_enough_money: "Check your balance if you have that amount.",
      spin_message: "Spinning the slot machine...",
      win_message: "You won $%1! Lucky spin!",
      lose_message: "Oops! You lost $%1.",
      jackpot_message: "JACKPOT! You won $%1 with three %2 symbols!",
      rare_jackpot: "RARE JACKPOT! You won $%1 with three 🔥 symbols!",
    },
  },

  onStart: async function ({ args, message, event, usersData, getLang }) {
    const { senderID } = event;
    const userData = await usersData.get(senderID);
    const amount = parseInt(args[0]);

    if (isNaN(amount) || amount <= 0)
      return message.reply(getLang("invalid_amount"));

    if (amount > userData.money)
      return message.reply(getLang("not_enough_money"));

    await message.reply(getLang("spin_message"));

    const slots = ["💚", "💛", "💙", "🔥"];
    const slot1 = slots[Math.floor(Math.random() * slots.length)];
    const slot2 = slots[Math.floor(Math.random() * slots.length)];
    const slot3 = slots[Math.floor(Math.random() * slots.length)];

    const winnings = calculateWinnings(slot1, slot2, slot3, amount);

    userData.money += winnings;

    await usersData.set(senderID, {
      money: userData.money,
      data: userData.data,
    });

    const messageText = getSpinResultMessage(slot1, slot2, slot3, winnings, getLang);
    return message.reply(messageText);
  },
};

function calculateWinnings(slot1, slot2, slot3, betAmount) {
  const winChance = Math.random();

  if (winChance < 0.6) {
    if (slot1 === slot2 && slot2 === slot3) {
      if (slot1 === "🔥") return betAmount * 20;
      if (slot1 === "💙") return betAmount * 10;
      if (slot1 === "💚") return betAmount * 5;
      if (slot1 === "💛") return betAmount * 3;
    } else if (slot1 === slot2 || slot2 === slot3 || slot1 === slot3) {
      return betAmount * 2;
    } else {
      return betAmount;
    }
  } else {
    return -betAmount;
  }
}

function getSpinResultMessage(slot1, slot2, slot3, winnings, getLang) {
  const resultLine = `\n[ ${slot1} | ${slot2} | ${slot3} ]`;

  if (winnings > 0) {
    if (slot1 === slot2 && slot2 === slot3 && slot1 === "🔥") {
      return getLang("rare_jackpot", winnings) + resultLine;
    }
    if (slot1 === slot2 && slot2 === slot3) {
      return getLang("jackpot_message", winnings, slot1) + resultLine;
    }
    return getLang("win_message", winnings) + resultLine;
  } else {
    return getLang("lose_message", -winnings) + resultLine;
  }
}
