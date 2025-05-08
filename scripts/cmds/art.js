const axios = require('axios');
const fs = require('fs-extra');

module.exports.config = {
  name: "art",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️",
  description: "Animefy: Turn real image into anime style",
  commandCategory: "media", // ✅ fixed category
  usages: "Reply to an image or provide image URL",
  cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
  const pathie = __dirname + `/cache/animefy.jpg`;
  const { threadID, messageID } = event;

  let imageUrl;

  // If replied to an image
  if (event.messageReply && event.messageReply.attachments.length > 0) {
    const attachment = event.messageReply.attachments[0];
    if (attachment.type === 'photo') {
      imageUrl = attachment.url;
    }
  }

  // If direct URL passed
  if (!imageUrl && args[0]) {
    const possibleUrl = args[0];
    if (/^https?:\/\/.+\.(jpg|jpeg|png|gif)$/i.test(possibleUrl)) {
      imageUrl = possibleUrl;
    }
  }

  if (!imageUrl) {
    return api.sendMessage("⚠️ দয়া করে একটি ছবি রিপ্লাই করো অথবা সরাসরি একটি image URL দাও।", threadID, messageID);
  }

  try {
    const lim = await axios.get(`https://animeify.shinoyama.repl.co/convert-to-anime?imageUrl=${encodeURIComponent(imageUrl)}`);
    if (!lim.data.urls || !lim.data.urls[1]) {
      return api.sendMessage("❌ Animefy API থেকে ইমেজ পাওয়া যায়নি। অন্য ছবি দিয়ে চেষ্টা করো।", threadID, messageID);
    }

    const animeUrl = `https://www.drawever.com${lim.data.urls[1]}`;
    const img = (await axios.get(animeUrl, { responseType: "arraybuffer" })).data;

    fs.writeFileSync(pathie, Buffer.from(img, 'utf-8'));

    api.sendMessage({
      body: "✅ Anime রূপান্তরিত ছবিটা নিচে:",
      attachment: fs.createReadStream(pathie)
    }, threadID, () => fs.unlinkSync(pathie), messageID);

  } catch (e) {
    api.sendMessage(`❌ কিছু একটা ভুল হয়েছে:\n\n${e.message}`, threadID, messageID);
  }
};
