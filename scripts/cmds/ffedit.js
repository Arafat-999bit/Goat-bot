const { GoatWrapper } = require('fca-liane-utils');
const axios = require('axios');

async function getStreamFromURL(url) {
  const response = await axios.get(url, { responseType: 'stream' });
  return response.data;
}

async function fetchFreeFireEdits(keyword) {
  try {
    const response = await axios.get(`https://lyric-search-neon.vercel.app/kshitiz?keyword=${keyword}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

module.exports = {
  config: {
    name: "freefireedit",
    aliases: ["ffedit", "FFedit", "FreeFireEdit", "freefire", "ff"],
    author: "Shan & Arafat",
    version: "1.0",
    shortDescription: {
      en: "Get Free Fire edit video",
    },
    longDescription: {
      en: "Search and send Free Fire edit videos from online source",
    },
    category: "MEDIA",
    guide: {
      en: "{p}ffedit [keyword]",
    },
  },

  onStart: async function ({ api, event, args }) {
    const userInput = args.join(' ').trim();

    if (!userInput) {
      api.sendMessage("Type something to search Free Fire edits (e.g., headshot, alok, montage).", event.threadID, event.messageID);
      return;
    }

    api.setMessageReaction("🔥", event.messageID, () => {}, true);

    const query = `${userInput} free fire edit`;

    const videos = await fetchFreeFireEdits(query);

    if (!videos || videos.length === 0) {
      api.sendMessage(`No Free Fire edit found for "${userInput}".`, event.threadID, event.messageID);
      return;
    }

    const selectedVideo = videos[Math.floor(Math.random() * videos.length)];
    const videoUrl = selectedVideo.videoUrl;

    if (!videoUrl) {
      api.sendMessage('Video URL not found.', event.threadID, event.messageID);
      return;
    }

    try {
      const videoStream = await getStreamFromURL(videoUrl);
      await api.sendMessage({
        body: "",
        attachment: videoStream,
      }, event.threadID, event.messageID);
    } catch (error) {
      console.error(error);
      api.sendMessage('Error occurred while fetching video. Try again later.', event.threadID, event.messageID);
    }
  },
};

const wrapper = new GoatWrapper(module.exports);
wrapper.applyNoPrefix({ allowPrefix: true });
