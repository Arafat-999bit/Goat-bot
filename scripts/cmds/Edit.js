const axios = require("axios");
const fs = require("fs-extra");
const FormData = require("form-data");

module.exports = {
  config: {
    name: "edit",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "Arafat Da",
    description: "ছবিতে ইনস্ট্রাকশন দিয়ে AI দিয়ে এডিট করো (Replicate)",
    category: "image",
    usages: "#edit [instruction] (image reply)",
    cooldowns: 10
  },

  onStart: async function ({ api, event, args }) {
    const replicate_api = "r8_7t1HM8djF2wR8zclvg6A2KWwKhYqvg01j5gI3";
    const imgbb_api = "d622c5729ca2a0b17123c4534b0c34ff";

    const instruction = args.join(" ");
    if (!event.messageReply || !event.messageReply.attachments || event.messageReply.attachments.length === 0)
      return api.sendMessage("একটা ছবির রিপ্লাইতে `#edit [instruction]` লিখ।", event.threadID, event.messageID);

    if (!instruction) return api.sendMessage("তুই কী করতে চাস সেটা লিখ। যেমন: `#edit add a girl beside the boy`", event.threadID, event.messageID);

    const imageUrl = event.messageReply.attachments[0].url;
    const imgPath = __dirname + `/cache/input_${event.messageID}.jpg`;
    const outPath = __dirname + `/cache/output_${event.messageID}.jpg`;

    try {
      // Download image
      const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(imgPath, response.data);

      api.sendMessage("ছবি এডিট হচ্ছে, একটু অপেক্ষা করো...", event.threadID);

      // Upload to imgbb
      const form = new FormData();
      form.append("image", fs.readFileSync(imgPath).toString("base64"));
      const imgbbUpload = await axios.post(`https://api.imgbb.com/1/upload?key=${imgbb_api}`, form, {
        headers: form.getHeaders()
      });
      const uploadedUrl = imgbbUpload.data.data.url;

      // Replicate request
      const replicateRes = await axios.post("https://api.replicate.com/v1/predictions", {
        version: "e2e06245e1f80cdeb65b01d6e6d3a3f01b2ec3dfeebafcb6d6c57641edc4ae99",
        input: {
          image: uploadedUrl,
          prompt: instruction
        }
      }, {
        headers: {
          Authorization: `Token ${replicate_api}`,
          "Content-Type": "application/json"
        }
      });

      const statusUrl = replicateRes.data.urls.get;

      // Wait for result
      let outputUrl = null;
      for (let i = 0; i < 20; i++) {
        const poll = await axios.get(statusUrl, {
          headers: { Authorization: `Token ${replicate_api}` }
        });
        if (poll.data.status === "succeeded") {
          outputUrl = poll.data.output;
          break;
        }
        await new Promise(res => setTimeout(res, 3000));
      }

      if (!outputUrl) return api.sendMessage("এডিট করা সম্ভব হয়নি বা টাইমআউট হয়ে গেছে।", event.threadID);

      // Download and send edited image
      const finalImg = await axios.get(outputUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(outPath, finalImg.data);

      return api.sendMessage({
        body: `তোর ইনস্ট্রাকশন: ${instruction}`,
        attachment: fs.createReadStream(outPath)
      }, event.threadID, () => {
        fs.unlinkSync(imgPath);
        fs.unlinkSync(outPath);
      });

    } catch (err) {
      console.error(err);
      return api.sendMessage("একটা সমস্যা হয়েছে! আবার চেষ্টা কর।", event.threadID);
    }
  }
};
