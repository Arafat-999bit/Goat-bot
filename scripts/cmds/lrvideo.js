const { GoatWrapper } = require('fca-liane-utils');
const axios = require('axios');

async function getStreamFromURL(url) {
  const response = await axios.get(url, { responseType: 'stream' });
  return response.data;
}

async function fetchLyricsVideos(query) {
  try {
    const response = await axios.get(`https://lyric-search-neon.vercel.app/kshitiz?keyword=${encodeURIComponent(query + " lyrics video")}`);
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    return null;
  }
}

module.exports = {
  config: {
    name: "lrvideo",
    aliases: [],
    author: "𝗔𝗿𝗮𝗳𝗮𝘁",
    version: "1.0",
    shortDescription: {
      en: "get lyrics video",
    },
    longDescription: {
      en: "search for songs' lyrics videos",
    },
    category: "𝗠𝗘𝗗𝗜𝗔",
    guide: {
      en: "{p}{n} [song name]",
    },
  },

  onStart: async function ({ api, event, args }) {
    const query = args.join(' ');
    if (!query) {
      return api.sendMessage("দয়া করে কোনো গানের নাম লেখো। যেমন:\n#lrvideo perfect ed sheeran", event.threadID, event.messageID);
    }

    api.setMessageReaction("🎵", event.messageID, () => {}, true);
    
    const videos = await fetchLyricsVideos(query);

    if (!Array.isArray(videos) || videos.length === 0) {
      return api.sendMessage(`"${query}" নামে কোনো লিরিক ভিডিও খুঁজে পাওয়া যায়নি।`, event.threadID, event.messageID);
    }

    const selectedVideo = videos[Math.floor(Math.random() * videos.length)];
    const videoUrl = selectedVideo.videoUrl;

    if (!videoUrl) {
      return api.sendMessage("দুঃখিত, ভিডিও লিংক খুঁজে পাওয়া যায়নি।", event.threadID, event.messageID);
    }

    try {
      const videoStream = await getStreamFromURL(videoUrl);
      await api.sendMessage({
        body: `গান: ${query}\nলিরিক ভিডিও পেয়ে গেছি!`,
        attachment: videoStream,
      }, event.threadID, event.messageID);
    } catch (error) {
      console.error(error);
      api.sendMessage("ভিডিও পাঠাতে সমস্যা হয়েছে। পরে আবার চেষ্টা করো।", event.threadID, event.messageID);
    }
  },
};

const wrapper = new GoatWrapper(module.exports);
wrapper.applyNoPrefix({ allowPrefix: true });
