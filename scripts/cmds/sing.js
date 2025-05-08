const axios = require("axios");
const baseApiUrl = async () => {
  const base = await axios.get(`https://raw.githubusercontent.com/Mostakim0978/D1PT0/refs/heads/main/baseApiUrl.json`);
  return base.data.api;
};

module.exports = {
  config: {
    name: "sing",
    version: "2.0.0",
    aliases: [],
    author: "𝗦𝗵𝗔𝗻 (Modified by Arafat Da)",
    countDown: 5,
    role: 0,
    description: {
      en: "Download audio from YouTube"
    },
    category: "𝗠𝗘𝗗𝗜𝗔",
    guide: {
      en: "{pn} [<song name>|<song link>]\nExample:\n{pn} chipi chipi chapa chapa"
    }
  },

  onStart: async ({ api, args, event, commandName, message }) => {
    const checkurl = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))((\w|-){11})(?:\S+)?$/;
    let videoID;
    const isUrl = checkurl.test(args[0]);

    if (isUrl) {
      const match = args[0].match(checkurl);
      videoID = match ? match[1] : null;
      const { data: { title, downloadLink, size } } = await axios.get(`${await baseApiUrl()}/ytDl3?link=${videoID}&format=mp3`);

      if (size > 26000000) return api.sendMessage(`⭕ Sorry, the audio size is more than 26MB.`, event.threadID, event.messageID);

      const audioStream = await dipto(downloadLink);
      return api.sendMessage({ body: title, attachment: audioStream }, event.threadID, event.messageID);
    }

    let keyWord = args.join(" ").replace("?feature=share", "");
    const maxResults = 6;
    let result;

    try {
      result = (await axios.get(`${await baseApiUrl()}/ytFullSearch?songName=${keyWord}`)).data.slice(0, maxResults);
    } catch (err) {
      return api.sendMessage("❌ Error fetching search results: " + err.message, event.threadID, event.messageID);
    }

    if (result.length === 0)
      return api.sendMessage("⭕ No search results match the keyword: " + keyWord, event.threadID, event.messageID);

    let msg = "";
    const thumbnails = [];
    for (let i = 0; i < result.length; i++) {
      const info = result[i];
      thumbnails.push(await diptoThumbnail(info.thumbnail));
      msg += `${i + 1}. ${info.title}\nTime: ${info.time}\nChannel: ${info.channel.name}\n\n`;
    }

    api.sendMessage({
      body: msg + "Reply to this message with the number of the song you want to listen to.",
      attachment: await Promise.all(thumbnails)
    }, event.threadID, (err, info) => {
      global.GoatBot.onReply.set(info.messageID, {
        commandName,
        messageID: info.messageID,
        author: event.senderID,
        result
      });
    }, event.messageID);
  },

  onReply: async ({ api, event, Reply }) => {
    try {
      const { result } = Reply;
      const choice = parseInt(event.body);

      if (!isNaN(choice) && choice >= 1 && choice <= result.length) {
        const infoChoice = result[choice - 1];
        const idvideo = infoChoice.id;

        const { data: { title, downloadLink, size, quality } } = await axios.get(`${await baseApiUrl()}/ytDl3?link=${idvideo}&format=mp3`);

        if (size > 26000000) 
          return api.sendMessage(`⭕ Sorry, the audio size is more than 26MB.`, event.threadID, event.messageID);

        const audioStream = await dipto(downloadLink);

        await api.unsendMessage(Reply.messageID);
        await api.sendMessage({
          body: `• Title: ${title}\n• Quality: ${quality}`,
          attachment: audioStream
        }, event.threadID, event.messageID);

      } else {
        api.sendMessage("⭕ Invalid choice. Please reply with a number between 1 and 6.", event.threadID, event.messageID);
      }
    } catch (error) {
      console.error(error);
      api.sendMessage(`❌ An error occurred: ${error.message}`, event.threadID, event.messageID);
    }
  }
};

// Helpers
async function dipto(url) {
  try {
    const response = await axios.get(url, { responseType: "stream" });
    return response.data;
  } catch (err) {
    throw err;
  }
}

async function diptoThumbnail(url) {
  try {
    const response = await axios.get(url, { responseType: "stream" });
    return response.data;
  } catch (err) {
    throw err;
  }
}
