const axios = require('axios');
const dipto = "https://www.noobs-api.rf.gd/dipto";

module.exports = {
  config: {
    name: "refine",
    version: "6.9",
    credits: "dipto",
    countDown: 5,
    hasPermssion: 1,
    category: "AI",
    description: "Edit images using Edit AI",
    usages: "[prompt]",
    cooldowns: 5
  },

  onStart: async function ({ api, event, args }) {
    if (!event.messageReply || !event.messageReply.attachments?.[0]?.url) {
      return api.sendMessage("❌ অনুগ্রহ করে একটি ছবির রিপ্লাই দিয়ে কমান্ড দিন।", event.threadID, event.messageID);
    }

    const url = event.messageReply.attachments[0].url;
    const prompt = args.join(" ") || "Enhance this image";

    try {
      const response = await axios.get(`${dipto}/edit?url=${encodeURIComponent(url)}&prompt=${encodeURIComponent(prompt)}`, {
        responseType: 'stream',
        validateStatus: () => true
      });

      if (response.headers['content-type']?.startsWith('image/')) {
        return api.sendMessage({ attachment: response.data }, event.threadID, event.messageID);
      }

      let responseData = '';
      for await (const chunk of response.data) {
        responseData += chunk.toString();
      }

      const jsonData = JSON.parse(responseData);
      if (jsonData?.response) {
        return api.sendMessage(jsonData.response, event.threadID, event.messageID);
      }

      return api.sendMessage("❌ API থেকে বৈধ কোনো রেসপন্স পাওয়া যায়নি।", event.threadID, event.messageID);
    } catch (err) {
      console.error("Edit command error:", err);
      return api.sendMessage("❌ অনুরোধ সম্পাদনে ব্যর্থ হয়েছে। পরে আবার চেষ্টা করুন।", event.threadID, event.messageID);
    }
  }
};
