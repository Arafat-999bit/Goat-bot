const fs = require("fs");

module.exports = {
  config: {
    name: "spy",
    version: "2.5",
    author: "Arafat",
    countDown: 5,
    role: 1,
    description: "ইউজার সম্পর্কে পুরো রিপোর্ট বের করে",
    category: "utility",
    guide: {
      en: "{pn} @mention / reply / UID"
    }
  },

  onStart: async function ({ event, api, usersData, message }) {
    const targetID = event.type === "message_reply"
      ? event.messageReply.senderID
      : Object.keys(event.mentions)[0] || event.senderID;

    try {
      const info = await usersData.get(targetID);
      const avatarUrl = await usersData.getAvatarUrl(targetID);
      const name = info.name || "Unknown";
      const coins = info.money || 0;
      const exp = info.exp || 0;
      const balance = info.data?.balance || 0;
      const commandUsed = info.data?.commandUse || 0;
      const gender = info.gender === "male" ? "পুরুষ" : info.gender === "female" ? "মহিলা" : "অজানা";
      const birthday = info.birthday || "উল্লেখ নেই";

      const msg = 
`╭──[ 🕵️‍♂️ SPY রিপোর্ট ]───✧
├─ নাম: ${name}
├─ ইউজার আইডি: ${targetID}
├─ লিঙ্গ: ${gender}
├─ জন্মতারিখ: ${birthday}
├─ কয়েন: ${coins} 💰
├─ ব্যালেন্স: ${balance} 🏦
├─ এক্সপি: ${exp} ⭐
├─ মোট কমান্ড দিয়েছে: ${commandUsed} 📊
╰──────────────────────────✦`;

      message.reply({
        body: msg,
        attachment: await global.utils.getStreamFromURL(avatarUrl)
      });
    } catch (err) {
      console.error(err);
      message.reply("❌ ইউজারের তথ্য আনতে সমস্যা হয়েছে!");
    }
  }
};
