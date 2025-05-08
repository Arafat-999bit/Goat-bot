const fs = require("fs");
const path = require("path");
const axios = require("axios");
 
module.exports = {
  config: {
    name: "imagine",
    aliases: ["imgine"],
    author: "𝗦𝗵𝗔𝗻",
    version: "1.0",
    cooldowns: 20,
    role: 0,
    shortDescription: "Generate an image based on a prompt.",
    longDescription: "Generates an image using the provided prompt.",
    category: "𝗔𝗜",
    guide: "{p}imagine <prompt>",
  },
  onStart: async function ({ message, args, api, event }) {
    // Obfuscated author name check
    const obfuscatedAuthor = String.fromCharCode(77, 97, 104, 105, 45, 45);
    if (this.config.author !== obfuscatedAuthor) {
      return api.sendMessage("You are not authorized to change the author name.", event.threadID, event.messageID);
    }
 
    const prompt = args.join(" ");
 
    if (!prompt) {
      return api.sendMessage("❌ | You need to provide a prompt.", event.threadID);
    }
 
    api.sendMessage("Please wait, we're making your picture...", event.threadID, event.messageID);
 
    try {
      const imagineApiUrl = `https://www.samirxpikachu.run.place/imagine?prompt=${encodeURIComponent(prompt)}`;
 
      const imagineResponse = await axios.get(imagineApiUrl, {
        responseType: "arraybuffer"
      });
 
      const cacheFolderPath = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheFolderPath)) {
        fs.mkdirSync(cacheFolderPath);
      }
      const imagePath = path.join(cacheFolderPath, `${Date.now()}_generated_image.png`);
      fs.writeFileSync(imagePath, Buffer.from(imagineResponse.data, "binary"));
 
      const stream = fs.createReadStream(imagePath);
      message.reply({
        body: "",
        attachment: stream
      });
    } catch (error) {
      console.error("Error:", error);
      message.reply("❌ | An error occurred. Please try again later.");
    }
  }
};
