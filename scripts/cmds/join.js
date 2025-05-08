module.exports = {
  config: {
    name: "join",
    version: "3.1",
    author: "Arafat Modified",
    countDown: 5,
    role: 0,
    shortDescription: "Join/add someone to a group",
    longDescription: "Reply with group number or number + tag to join or add",
    category: "owner",
    guide: {
      en: "{p}{n}",
    },
  },

  onStart: async function ({ api, event }) {
    if (event.senderID !== "100051997177668") {
      return api.sendMessage(
        "🎩এই কমান্ড টি আপনার জন্য নয় অন্য গ্ৰুপে এড হতে আরাফাত এর সাথে যোগাযোগ করুন Facebook.com/arafatas602 👑",
        event.threadID
      );
    }

    try {
      const groupList = await api.getThreadList(50, null, ["INBOX"]);
      const filteredList = groupList.filter(g => g.isGroup && g.threadName);

      if (filteredList.length === 0) {
        return api.sendMessage("❌ কোনো গ্রুপ খুঁজে পাওয়া যায়নি।", event.threadID);
      }

      const formatted = filteredList.map((g, i) =>
        ` ${i + 1}. ${g.threadName} [${g.participantIDs.length} জন]\n    TID: ${g.threadID}`
      ).join("\n");

      const msg = `╭─❖ 𝐆𝐫𝐨𝐮𝐩 𝐋𝐢𝐬𝐭 ❖─╮\n${formatted}\n╰────────────────╯\n\nসংখ্যা দিলে তুমি জয়েন হবে।\nসংখ্যা + ট্যাগ দিলে সে জয়েন হবে।`;

      const sent = await api.sendMessage(msg, event.threadID);
      global.GoatBot.onReply.set(sent.messageID, {
        commandName: "join",
        author: event.senderID,
        messageID: sent.messageID,
        groupList: filteredList,
      });
    } catch (err) {
      console.error("Error listing groups:", err);
      api.sendMessage("❌ গ্রুপ লিস্ট আনতে সমস্যা হয়েছে।", event.threadID);
    }
  },

  onReply: async function ({ api, event, Reply }) {
    const { author, groupList, messageID } = Reply;
    if (event.senderID !== author) return;

    const args = event.body.trim().split(/\s+/);
    const number = parseInt(args[0]);
    const mentionID = Object.keys(event.mentions)[0];

    if (!number || number <= 0 || number > groupList.length) {
      return api.sendMessage("⚠️ সঠিকভাবে নাম্বার দিন (যেমন: 2 অথবা 2 @Someone)", event.threadID, event.messageID);
    }

    const selectedGroup = groupList[number - 1];
    const groupID = selectedGroup.threadID;

    // Determine whom to add: tagged user or self
    const targetID = mentionID || event.senderID;
    const targetName = mentionID ? event.mentions[mentionID].replace("@", "") : "আপনি";

    try {
      const threadInfo = await api.getThreadInfo(groupID);

      if (threadInfo.participantIDs.includes(targetID)) {
        return api.sendMessage(`${targetName} ইতিমধ্যেই "${selectedGroup.threadName}" গ্রুপে রয়েছে।`, event.threadID, event.messageID);
      }

      if (threadInfo.participantIDs.length >= 250) {
        return api.sendMessage(`❌ "${selectedGroup.threadName}" গ্রুপটি পূর্ণ।`, event.threadID, event.messageID);
      }

      // Restrict others from adding people (only you can do it)
      if (mentionID && event.senderID !== "100051997177668") {
        return api.sendMessage(
          "🎩এই কমান্ড টি আপনার জন্য নয়\nঅন্য গ্ৰুপে এড হতে আরাফাত এর সাথে যোগাযোগ করুন\nFacebook.com/arafatas602 👑",
          event.threadID
        );
      }

      await api.addUserToGroup(targetID, groupID);
      api.sendMessage(`✅ ${targetName} কে "${selectedGroup.threadName}" গ্রুপে যোগ করা হয়েছে।`, event.threadID, event.messageID);
    } catch (err) {
      console.error("Join group error:", err);
      api.sendMessage("❌ ইউজারকে যোগ করতে সমস্যা হয়েছে।", event.threadID, event.messageID);
    } finally {
      global.GoatBot.onReply.delete(messageID);
    }
  }
};
