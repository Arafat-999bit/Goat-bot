const { GoatWrapper } = require('fca-liane-utils');
const axios = require('axios');

async function getStreamFromURL(url) {
  const response = await axios.get(url, { responseType: 'stream' });
  return response.data;
}

async function fetchFootballEdits(keyword) {
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
    name: "footballedit",
    aliases: [],
    author: "𝗦𝗵𝗔𝗻",
    version: "1.0",
    shortDescription: {
      en: "Get football edit video",
    },
    longDescription: {
      en: "Search and send football edit videos from online source",
    },
    category: "MEDIA",
    guide: {
      en: "{p}footballedit [player name or keyword]",
    },
  },

  onStart: async function ({ api, event, args }) {
    const userInput = args.join(' ').trim();

    if (!userInput) {
      api.sendMessage("Please enter a football-related keyword (e.g., messi, ronaldo, ucl).", event.threadID, event.messageID);
      return;
    }

    api.setMessageReaction("⚽", event.messageID, () => {}, true);

    const query = `${userInput} football edit`;

    const videos = await fetchFootballEdits(query);

    if (!videos || videos.length === 0) {
      api.sendMessage(`No football edit found for "${userInput}".`, event.threadID, event.messageID);
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
