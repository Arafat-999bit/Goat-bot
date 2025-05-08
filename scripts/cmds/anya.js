const { GoatWrapper } = require('fca-liane-utils');
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "anya",
    aliases: ["anya"],
    author: "𝗦𝗵𝗔𝗻",
    version: "3.1",
    cooldowns: 5,
    role: 0,
    shortDescription: { en: "Chat with Anya Forger" },
    longDescription: { en: "Chat with Anya Forger. Now powered by Redwans API!" },
    category: "𝗔𝗜",
    guide: { en: "{p}{n} [text]" },
  },

  onStart: async function ({ api, event, args, message }) {
    try {
      const { createReadStream, unlinkSync } = fs;
      const { resolve } = path;
      const { messageID, threadID, senderID } = event;

      const getUserInfo = async (api, userID) => {
        try {
          const userInfo = await api.getUserInfo(userID);
          return userInfo[userID]?.firstName || "User";
        } catch {
          return "User";
        }
      };

      const greetings = ["Konichiwa", "Yaho", "Ohayo", "Senpai~", "Moshi Moshi"];
      const userName = await getUserInfo(api, senderID);
      const greeting = `${greetings[Math.floor(Math.random() * greetings.length)]} ${userName}!`;

      if (!args[0]) return message.reply(greeting);

      const chat = args.join(" ");
      const translateResponse = await axios.get(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=ja&dt=t&q=${encodeURIComponent(chat)}`
      );
      const translatedText = translateResponse.data?.[0]?.[0]?.[0] || chat;

      const ttsResponse = await axios.get(
        `https://global-redwans-apis.onrender.com/api/aniv?speaker=1&text=${encodeURIComponent(translatedText)}`
      );

      if (!ttsResponse.data || !ttsResponse.data.success || !ttsResponse.data.data) {
        return message.reply("⚠️ Failed to generate Anya's voice. Try again later!");
      }

      const { mp3StreamingUrl } = ttsResponse.data.data;
      const audioPath = resolve(__dirname, "cache", `${threadID}_${senderID}.mp3`);

      const downloadFile = async (url, path) => {
        const response = await axios({ url, method: "GET", responseType: "stream" });
        return new Promise((resolve, reject) => {
          const writer = fs.createWriteStream(path);
          response.data.pipe(writer);
          writer.on("finish", resolve);
          writer.on("error", reject);
        });
      };

      await downloadFile(mp3StreamingUrl, audioPath);

      message.reply(
        { body: translatedText, attachment: createReadStream(audioPath) },
        threadID,
        () => unlinkSync(audioPath)
      );
    } catch (error) {
      console.error(error);
      message.reply("⚠️ An error occurred while processing your request. Please try again later.");
    }
  },
};
const wrapper = new GoatWrapper(module.exports);
    wrapper.applyNoPrefix({ allowPrefix: true });
