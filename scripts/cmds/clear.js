module.exports = {
  config: {
    name: "clear",
    aliases: [],
    author: "kshitiz",  
    version: "2.0",
    cooldowns: 5,
    role: 0,
    shortDescription: {
      en: "বটের মেসেজ মুছুন"
    },
    longDescription: {
      en: "এই কমান্ডটি বট যেসব মেসেজ পাঠিয়েছে তা আনসেন্ড করে দেয় (সর্বোচ্চ ৫০টি)"
    },
    category: "𝗕𝗢𝗫",
    guide: {
      en: "{p}{n}"
    }
  },

  onStart: async function ({ api, event }) {
    try {
      const threadID = event.threadID;
      const history = await api.getThreadHistory(threadID, 50);
      const botID = api.getCurrentUserID();
      const botMessages = history.filter(msg => msg.senderID === botID);

      for (const msg of botMessages) {
        await api.unsendMessage(msg.messageID);
      }

    } catch (err) {
      console.error("মেসেজ আনসেন্ড করতে সমস্যা হয়েছে:", err);
      api.sendMessage("মেসেজ মুছে ফেলতে গিয়ে কোনো সমস্যা হয়েছে।", event.threadID);
    }
  }
};
