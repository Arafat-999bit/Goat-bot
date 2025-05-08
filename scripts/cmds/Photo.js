const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
  config: {
    name: "photo",
    version: "2.3",
    author: "Arafat",
    role: 0,
    shortDescription: { en: "Get images from Pixabay" },
    longDescription: { en: "Fetch up to 50 images by keyword from Pixabay and auto-delete after 20s" },
    category: "media"
  },

  onStart: async function ({ message, args }) {
    const keyword = args.slice(0, -1).join(" ") || args.join(" ");
    const amount = Math.min(parseInt(args[args.length - 1]) || 1, 50);
    const apiKey = '49769725-8378f1c6766c9400bc7f69fc8';

    if (!keyword || keyword.toLowerCase() === "on" || keyword.toLowerCase() === "off") {
      return message.reply("Please provide a keyword. Example: #photo cat 3");
    }

    const msg = await message.reply(`Fetching ${amount} image(s) for: "${keyword}"...`);

    try {
      const res = await axios.get(`https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(keyword)}&image_type=photo&per_page=${amount}`);
      const images = res.data.hits;

      if (!images || images.length === 0) return message.reply("No images found for your keyword.");

      const attachments = [];

      for (let i = 0; i < images.length; i++) {
        const imgUrl = images[i].largeImageURL;
        const imgPath = path.join(__dirname, `photo_${i}.jpg`);
        const imgData = await axios.get(imgUrl, { responseType: 'arraybuffer' });
        fs.writeFileSync(imgPath, imgData.data);
        attachments.push(fs.createReadStream(imgPath));
      }

      const sent = await message.reply({
        body: `Here are your "${keyword}" images`,
        attachment: attachments
      });

      setTimeout(() => {
        message.unsend(sent.messageID);
        attachments.forEach(a => fs.unlinkSync(a.path));
      }, 20000); // 20 সেকেন্ডে ডিলিট

    } catch (err) {
      console.error("Fetch error:", err.message);
      return message.reply("Something went wrong while fetching images. Please try again.");
    }
  }
};
