const axios = require("axios");
const fs = require('fs');

const baseApiUrl = async () => {
  const base = await axios.get(`https://raw.githubusercontent.com/Mostakim0978/D1PT0/refs/heads/main/baseApiUrl.json`);
  return base.data.api;
};

module.exports = {
  config: {
    name: "videos",
    version: "1.1.6",
    aliases: [],
    author: "𝗦𝗵𝗔𝗻",
    countDown: 5,
    role: 0,
    description: {
      en: "Download video from YouTube"
    },
    category: "𝗠𝗘𝗗𝗜𝗔",
    guide: {
      en: "{pn} [<song name>|<YouTube link>]\nExample:\n{pn} faded alan walker"
    }
  },

  onStart: async ({ api, args, event, commandName, message }) => {
    const checkurl = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))((\w|-){11})(?:\S+)?$/;
    let videoID;
    const urlYtb = checkurl.test(args[0]);

    if (urlYtb) {
      const match = args[0].match(checkurl);
      videoID = match ? match[1] : null;
      const { data: { title, downloadLink } } = await axios.get(
        `${await baseApiUrl()}/ytDl3?link=${videoID}&format=mp4`
      );
      try {
        const stream = await dipto(downloadLink, 'video.mp4');
        return api.sendMessage({
          body: title,
          attachment: stream
        }, event.threadID, () => fs.unlinkSync('video.mp4'), event.messageID);
      } catch (e) {
        return api.sendMessage("⭕ Video is too large (limit: 50MB). Try another one.", event.threadID, event.messageID);
      }
    }

    let keyWord = args.join(" ");
    keyWord = keyWord.includes("?feature=share") ? keyWord.replace("?feature=share", "") : keyWord;
    const maxResults = 6;
    let result;
    try {
      result = ((await axios.get(`${await baseApiUrl()}/ytFullSearch?songName=${keyWord}`)).data).slice(0, maxResults);
    } catch (err) {
      return api.sendMessage("❌ Error occurred: " + err.message, event.threadID, event.messageID);
    }

    if (result.length == 0)
      return api.sendMessage("⭕ No results found for: " + keyWord, event.threadID, event.messageID);

    let msg = "";
    const thumbnails = [];
    let i = 1;

    for (const info of result) {
      try {
        thumbnails.push(await diptoSt(info.thumbnail, `thumb${i}.jpg`));
      } catch (e) {
        console.log("Thumbnail error:", e.message);
      }
      msg += `${i++}. ${info.title}\nTime: ${info.time}\nChannel: ${info.channel.name}\n\n`;
    }

    api.sendMessage({
      body: msg + "Reply with the number you want to download the video of.",
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

  onReply: async ({ event, api, Reply }) => {
    try {
      const { result } = Reply;
      const choice = parseInt(event.body);
      if (!isNaN(choice) && choice <= result.length && choice > 0) {
        const infoChoice = result[choice - 1];
        const idvideo = infoChoice.id;

        const { data: { title, downloadLink, quality } } = await axios.get(
          `${await baseApiUrl()}/ytDl3?link=${idvideo}&format=mp4`
        );

        await api.unsendMessage(Reply.messageID);

        try {
          const stream = await dipto(downloadLink, 'video.mp4');
          await api.sendMessage({
            body: `• Title: ${title}\n• Quality: ${quality}`,
            attachment: stream
          }, event.threadID, () => fs.unlinkSync('video.mp4'), event.messageID);
        } catch (e) {
          api.sendMessage("⭕ Video is too large (limit: 50MB). Try another one.", event.threadID, event.messageID);
        }
      } else {
        api.sendMessage("Invalid choice. Please enter a number between 1 and 6.", event.threadID, event.messageID);
        global.GoatBot.onReply.delete(Reply.messageID);
      }
    } catch (error) {
      console.log(error);
      api.sendMessage("⭕ Failed to download video.", event.threadID, event.messageID);
    }
  }
};

async function dipto(url, pathName) {
  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'arraybuffer'
    });

    const fileSizeInMB = Buffer.byteLength(response.data) / (1024 * 1024);
    if (fileSizeInMB > 50) {
      throw new Error(`File too large: ${fileSizeInMB.toFixed(2)}MB`);
    }

    fs.writeFileSync(pathName, Buffer.from(response.data));
    return fs.createReadStream(pathName);
  } catch (err) {
    throw err;
  }
}

async function diptoSt(url, pathName) {
  try {
    const response = await axios.get(url, {
      responseType: "stream"
    });
    response.data.path = pathName;
    return response.data;
  } catch (err) {
    throw err;
  }
}
