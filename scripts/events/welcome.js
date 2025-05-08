const { getTime, drive } = global.utils;
if (!global.temp.welcomeEvent)
	global.temp.welcomeEvent = {};

module.exports = {
	config: {
		name: "welcome",
		version: "1.7",
		author: "𝑺𝒉𝑨𝒏",
		category: "events"
	},

	langs: {
		vi: {
			session1: "sáng",
			session2: "trưa",
			session3: "chiều",
			session4: "tối",
			welcomeMessage: "Cảm ơn bạn đã mời tôi vào nhóm!\nPrefix bot: %1\nĐể xem danh sách lệnh hãy nhập: %1help",
			multiple1: "bạn",
			multiple2: "các bạn",
			defaultWelcomeMessage: "Xin chào {userName}.\nChào mừng bạn đến với {boxName}.\nChúc bạn có buổi {session} vui vẻ!"
		},
		en: {
			session1: "𝐌𝐎𝐑𝐍𝐈𝐍𝐆",
			session: "𝐍𝐎𝐎𝐍",
			session3: "𝐀𝐅𝐓𝐄𝐑𝐍𝐎𝐎𝐍",
			session4: "𝐄𝐕𝐄𝐍𝐈𝐍𝐆",
			session5: "𝐍𝐈𝐆𝐇𝐓",
			welcomeMessage: `𝐀𝐒𝐒𝐀𝐋𝐀𝐌𝐔𝐀𝐊𝐀𝐈𝐊𝐔𝐌\n	 `
				+ `\n ♻ 𝐓𝐇𝐄 𝐁𝐎𝐓 𝐇𝐀𝐒 𝐁𝐄𝐄𝐍 𝐂𝐎𝐍𝐍𝐄𝐂𝐄𝐓 𝐓𝐎 𝐓𝐇𝐄 𝐆𝐑𝐎𝐔𝐏 ⚜`
				+ `\n ⚜🔹𝐁𝐎𝐓 𝐏𝐑𝐄𝐅𝐈𝐗🔹: %1`
				+ `\n __________________________`
				+ `\n ~𝐎𝐖𝐍𝐄𝐑🔹:https://www.facebook.com/arafatas602`
				+ `\n __________________________`
				+ `\n 💠|❇ 𝐓𝐎 𝐕𝐈𝐄𝐖 𝐂𝐎𝐌𝐌𝐀𝐌𝐃𝐒 𝐏𝐋𝐀𝐒𝐄 𝐄𝐍𝐓𝐄𝐑: %1help`,
			multiple1: "𝐓𝐎 𝐓𝐇𝐄",
			multiple2: "𝐓𝐎 𝐎𝐔𝐑",
			defaultWelcomeMessage: `✨ 𝐀𝐒𝐒𝐀𝐋𝐀𝐌𝐔𝐀𝐊𝐀𝐈𝐊𝐔𝐌 ✨\n 	 \n~🦋 𝐇𝐄𝐋𝐋𝐎 𝐃𝐄𝐀𝐑 {userName}.\n~😽𝐖𝐄𝐋𝐂𝐎𝐌𝐄 {multiple} 𝐂𝐇𝐀𝐓 𝐆𝐑𝐎𝐔𝐏:{boxName} \n~💫𝐖𝐈𝐒𝐇𝐈𝐍𝐆 𝐖𝐄 𝐀 𝐋𝐎𝐕𝐄𝐋𝐘 {session} 😜`
		}
	},

	onStart: async ({ threadsData, message, event, api, getLang }) => {
		if (event.logMessageType == "log:subscribe")
			return async function () {
				const hours = getTime("HH");
				const { threadID } = event;
				const { nickNameBot } = global.GoatBot.config;
				const prefix = global.utils.getPrefix(threadID);
				const dataAddedParticipants = event.logMessageData.addedParticipants;
				// if new member is bot
				if (dataAddedParticipants.some((item) => item.userFbId == api.getCurrentUserID())) {
					if (nickNameBot)
						api.changeNickname(nickNameBot, threadID, api.getCurrentUserID());
					return message.send(getLang("welcomeMessage", prefix));
				}
				// if new member:
				if (!global.temp.welcomeEvent[threadID])
					global.temp.welcomeEvent[threadID] = {
						joinTimeout: null,
						dataAddedParticipants: []
					};

				// push new member to array
				global.temp.welcomeEvent[threadID].dataAddedParticipants.push(...dataAddedParticipants);
				// if timeout is set, clear it
				clearTimeout(global.temp.welcomeEvent[threadID].joinTimeout);

				// set new timeout
				global.temp.welcomeEvent[threadID].joinTimeout = setTimeout(async function () {
					const threadData = await threadsData.get(threadID);
					if (threadData.settings.sendWelcomeMessage == false)
						return;
					const dataAddedParticipants = global.temp.welcomeEvent[threadID].dataAddedParticipants;
					const dataBanned = threadData.data.banned_ban || [];
					const threadName = threadData.threadName;
					const userName = [],
						mentions = [];
					let multiple = false;

					if (dataAddedParticipants.length > 1)
						multiple = true;

					for (const user of dataAddedParticipants) {
						if (dataBanned.some((item) => item.id == user.userFbId))
							continue;
						userName.push(user.fullName);
						mentions.push({
							tag: user.fullName,
							id: user.userFbId
						});
					}
					// {userName}:   name of new member
					// {multiple}:
					// {boxName}:    name of group
					// {threadName}: name of group
					// {session}:    session of day
					if (userName.length == 0) return;
					let { welcomeMessage = getLang("defaultWelcomeMessage") } =
						threadData.data;
					const form = {
						mentions: welcomeMessage.match(/\{userNameTag\}/g) ? mentions : null
					};
					welcomeMessage = welcomeMessage
						.replace(/\{userName\}|\{userNameTag\}/g, userName.join(", "))
						.replace(/\{boxName\}|\{threadName\}/g, threadName)
						.replace(
							/\{multiple\}/g,
							multiple ? getLang("multiple2") : getLang("multiple1")
						)
						.replace(
							/\{session\}/g,
							hours <= 10
								? getLang("session1")
								: hours <= 12
									? getLang("session2")
									: hours <= 18
										? getLang("session3")
										: getLang("session4")
						);

					form.body = welcomeMessage;

					if (threadData.data.welcomeAttachment) {
						const files = threadData.data.welcomeAttachment;
						const attachments = files.reduce((acc, file) => {
							acc.push(drive.getFile(file, "stream"));
							return acc;
						}, []);
						form.attachment = (await Promise.allSettled(attachments))
							.filter(({ status }) => status == "fulfilled")
							.map(({ value }) => value);
					}
					message.send(form);
					delete global.temp.welcomeEvent[threadID];
				}, 1500);
			};
	}
};
