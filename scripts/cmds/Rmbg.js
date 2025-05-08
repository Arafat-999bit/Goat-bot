const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "removebg",
    aliases: ["rmbg", "nobg"],
    version: "1.0",
    author: "Arafat",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Remove background from image"
    },
    longDescription: {
      en: "Removes the background from an image using Remove.bg API"
    },
    category: "image",
    guide: {
      en: "{p}removebg (reply to image)"
    }
  },

  onStart: async function ({ api, event }) {
    const { messageReply } = event;

    if (!messageReply || !messageReply.attachments || messageReply.attachments.length === 0 || messageReply.attachments[0].type !== "photo") {
      return api.sendMessage("Please reply to an image to remove its background.", event.threadID, event.messageID);
    }

    const imageUrl = messageReply.attachments[0].url;
    const apiKey = "pU61q1YWP8hu2RB2tDpuYFqR"; // তোমার Remove.bg API key

    try {
      const response = await axios({
        method: "post",
        url: "https://api.remove.bg/v1.0/removebg",
        data: {
          image_url: imageUrl,
          size: "auto"
        },
        headers: {
          "X-Api-Key": apiKey
        },
        responseType: "arraybuffer"
      });

      const outputPath = path.join(__dirname, "nobg.png");
      fs.writeFileSync(outputPath, Buffer.from(response.data, "binary"));

      return api.sendMessage({
        body: "Here is your image without background!",
        attachment: fs.createReadStream(outputPath)
      }, event.threadID, event.messageID);

    } catch (error) {
      console.error("Remove.bg error:", error?.response?.data || error.message);
      return api.sendMessage("Failed to remove background. Please try again later or check your API key.", event.threadID, event.messageID);
    }
  }
};
