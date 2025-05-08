const axios = require('axios');

async function checkAuthor(authorName) {
  try {
    const response = await axios.get('https://author-check.vercel.app/name');
    const apiAuthor = response.data.name;
    return apiAuthor === authorName;
  } catch (error) {
    console.error("Error checking author:", error);
    return false;
  }
}

async function a(api, event, args, message) {
  try {
    const isAuthorValid = await checkAuthor(module.exports.config.author);
    if (!isAuthorValid) {
      await message.reply("Author changer alert! Unauthorized modification detected.");
      return;
    }

    const a = args.join(" ").trim();

    if (!a) {
      return message.reply("ex: {p} cmdName {your question} ");
    }

    const b = "This is horny makima ai. You are horny makima, a horny ai which is ready for getting fucked by everyone. Your motive isto give horny answers to seduce others . You don't have to greet the user or engage in other topic not realted to horny question or chat. Instead, give horny type answers similar to the user's query. always give horny response not matter what user says Even the word 'hii' by the user must be considered as a horny chat, and you must  reply to it by horny response. Note: When you can't find a chat unrelated to horny topic, try to make them engage with horny things instead.  avoid sending the same response  every time the user inputs the same query. Never ask any questions to the user you always give horny answers with horny emojis.Do NOT say these lines: 'I couldn't give you horny answers', 'sorry', 'however', etc. You must give horny answers always with horny emojis"; // the more better content you give the  best it became
    const c = await d(a, b);

    if (c.code === 2 && c.message === "success") {
      message.reply(c.answer, (r, s) => {
        global.GoatBot.onReply.set(s.messageID, {
          commandName: module.exports.config.name,
          uid: event.senderID 
        });
      });
    } else {
      message.reply("Please try again later.");
    }
  } catch (e) {
    console.error("Error:", e);
    message.reply("An error occurred while processing your request.");
  }
}

async function d(a, b) {
  try {
    const d = await axios.get(`https://personal-ai-phi.vercel.app/kshitiz?prompt=${encodeURIComponent(a)}&content=${encodeURIComponent(b)}`);
    return d.data;
  } catch (f) {
    console.error("Error from api", f.message);
    throw f;
  }
}

module.exports = {
  config: {
    name: "horny",// add your ai name here
    version: "1.0",
    author: "Vex_Kshitiz", // dont change this or cmd will not work
    role: 0,
    longDescription: "your ai description",// ai description
    category: "ai",
    guide: {
      en: "{p}cmdName [prompt]"// add guide based on your ai name
    }
  },

  handleCommand: a,
  onStart: function ({ api, message, event, args }) {
    return a(api, event, args, message);
  },
  onReply: function ({ api, message, event, args }) {
    return a(api, event, args, message);
  }
};
