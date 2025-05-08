const moment = require('moment-timezone');

module.exports = {
  config: {
    name: "uptime",
    aliases:["up", "upt"],
    version: "1.7",
    author: "𝗦𝗵𝗔𝗻",
    role: 0,
    shortDescription: {
      en: "Get stylish bot stats and uptime!"
    },
    longDescription: {
      en: "Displays bot uptime, user, thread stats, and total messages processed in a modern and visually engaging style."
    },
    category: "𝗜𝗡𝗙𝗢",
    guide: {
      en: "Use {p}uptime to display the bot's stats in style."
    }
  },
  onStart: async function ({ api, event, usersData, threadsData, messageCount }) {
    try {
      const allUsers = await usersData.getAll();
      const allThreads = await threadsData.getAll();
      const uptime = process.uptime();

      // Calculate formatted uptime
      const now = moment().tz('Asia/Dhaka');
      const date = now.format('MMMM Do YYYY');
      const time = now.format('h:mm:ss A');
      const days = Math.floor(uptime / 86400);
      const hours = Math.floor((uptime % 86400) / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);
      const seconds = Math.floor(uptime % 60);

      const uptimeString = `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;

      // Active threads (threads with activity)
      const activeThreads = allThreads.filter(thread => thread.messageCount > 0).length;

      // Total messages processed
      const totalMessages = messageCount || 0; // Replace with actual message count logic if needed

      // Stylish message design
      const message = `
 ┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
   💫《 ⩸__𝐁𝐨𝐭 𝐈𝐧𝐟𝐨𝐫𝐦𝐚𝐭𝐢𝐨𝐧__⩸ 》💫
  🤖..𝐵𝑜𝑡 𝑁𝑎𝑚𝑒 : ⩸__${global.GoatBot.config.nickNameBot}__⩸
  👾 𝐵𝑜𝑡 𝑆𝑦𝑠𝑡𝑒𝑚 𝑃𝑟𝑒𝑓𝑖𝑥 : ${global.GoatBot.config.prefix}
  ⏰ 𝑇𝑖𝑚𝑒: ${time}
  📆 𝐷𝑎𝑡𝑒: ${date}
  📛 𝐵𝑜𝑡 𝐼𝑠 𝑅𝑢𝑛𝑛𝑖𝑛𝑔 𝐹𝑜𝑟: ${uptimeString}
  🙋 𝑇𝑜𝑡𝑎𝑙 𝑈𝑠𝑒𝑟𝑠: ${allUsers.length}
  💬 𝑇𝑜𝑡𝑎𝑙 𝑇ℎ𝑟𝑒𝑎𝑑𝑠: ${allThreads.length}
  🔥 𝐴𝑐𝑡𝑖𝑣𝑒 𝑇ℎ𝑟𝑒𝑎𝑑𝑠: ${activeThreads}
  📨 𝑇𝑜𝑡𝑎𝑙 𝑀𝑒𝑠𝑠𝑎𝑔𝑒: ${totalMessages}
  ━━━━━━━━━━━━━━━━━━━
 💡 𝐾𝑒𝑒𝑝 𝑇ℎ𝑒 𝑉𝑖𝑏𝑒𝑠 𝐺𝑜𝑖𝑛𝑔!
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛
      `;

      api.sendMessage(message.trim(), event.threadID);
    } catch (error) {
      console.error(error);
      api.sendMessage("An error occurred while retrieving bot stats.", event.threadID);
    }
  }
};
