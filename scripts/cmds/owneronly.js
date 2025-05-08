const { config } = global.GoatBot;
module.exports = {
	config: {
		name: "owneronly",
		aliases:["ool"],
		version: "1.0",
		author: "𝗦𝗵𝗔𝗻",
		countDown: 5,
		role: 2,
		longDescription: {
			en: "Add, remove, edit ownerOnlyIds"
		},
		category: "𝗕𝗢𝗧 𝗠𝗔𝗡𝗔𝗚𝗘𝗠𝗘𝗡𝗧",
		guide: {
			en: '   {pn} [add | -a] <uid | @tag>: Add Owner role for user'
				+ '\n   {pn} [remove | -r] <uid | @tag>: Remove Owner role of user'
				+ '\n   {pn} [list | -l]: List all owner'
        + '\n   {pn} [ on | off ]: enable and disable ownerOnly mode'
		}
	},

	langs: {
		en: {
			added: "✅ | Added Owneronly role for %1 users:\n%2",
			alreadyAdmin: "\n⚠ | %1 users already have Owneronly role:\n%2",
			missingIdAdd: "⚠ | Please enter ID or tag user to add in ownerlistIds",
			removed: "✅ | Removed ownerlist role of %1 users:\n%2",
			notAdmin: "⚠ | %1 users don't have Ownerlist role:\n%2",
			missingIdRemove: "⚠ | Please enter ID or tag user to remove OwnerListIds",
			listAdmin: "👑 | List of Ownerlist:\n%1",
      enable: "Turned on the mode only Owner can use bot",
      disable: "Turned off the mode only Owner can use bot"
		}
	},

	onStart: async function ({ message, args, usersData, event, getLang, api }) {
    const permission = ["100051997177668"];
    if (!permission.includes(event.senderID)) {
      api.sendMessage(
        "~Who are you bby tumar ki lojjah sorom nai ?!🐐🤌",
        event.threadID,
        event.messageID
      );
      return;
    }
    const { writeFileSync } = require("fs-extra");
		switch (args[0]) {
			case "add":
			case "-a": {
				if (args[1]) {
					let uids = [];
					if (Object.keys(event.mentions).length > 0)
						uids = Object.keys(event.mentions);
					else if (event.messageReply)
						uids.push(event.messageReply.senderID);
					else
						uids = args.filter(arg => !isNaN(arg));
					const notAdminIds = [];
					const adminIds = [];
					for (const uid of uids) {
						if (config.ownerOnlyMood.ownerOnlyIds.includes(uid))
							adminIds.push(uid);
						else
							notAdminIds.push(uid);
					}

					config.ownerOnlyMood.ownerOnlyIds.push(...notAdminIds);
					const getNames = await Promise.all(uids.map(uid => usersData.getName(uid).then(name => ({ uid, name }))));
					writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));
					return message.reply(
						(notAdminIds.length > 0 ? getLang("added", notAdminIds.length, getNames.map(({ uid, name }) => `• ${name} (${uid})`).join("\n")) : "")
						+ (adminIds.length > 0 ? getLang("alreadyAdmin", adminIds.length, adminIds.map(uid => `• ${uid}`).join("\n")) : "")
					);
				}
				else
					return message.reply(getLang("missingIdAdd"));
			}
			case "remove":
			case "-r": {
				if (args[1]) {
					let uids = [];
					if (Object.keys(event.mentions).length > 0)
						uids = Object.keys(event.mentions)[0];
					else
						uids = args.filter(arg => !isNaN(arg));
					const notAdminIds = [];
					const adminIds = [];
					for (const uid of uids) {
						if (config.ownerOnlyMood.ownerOnlyIds.includes(uid))
							adminIds.push(uid);
						else
							notAdminIds.push(uid);
					}
					for (const uid of adminIds)
						config.ownerOnlyMood.ownerOnlyIds.splice(config.ownerOnlyMood.ownerOnlyIds.indexOf(uid), 1);
					const getNames = await Promise.all(adminIds.map(uid => usersData.getName(uid).then(name => ({ uid, name }))));
					writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));
					return message.reply(
						(adminIds.length > 0 ? getLang("removed", adminIds.length, getNames.map(({ uid, name }) => `• ${name} (${uid})`).join("\n")) : "")
						+ (notAdminIds.length > 0 ? getLang("notAdmin", notAdminIds.length, notAdminIds.map(uid => `• ${uid}`).join("\n")) : "")
					);
				}
				else
					return message.reply(getLang("missingIdRemove"));
			}
			case "list":
			case "-l": {
				const getNames = await Promise.all(config.ownerOnlyMood.ownerOnlyIds.map(uid => usersData.getName(uid).then(name => ({ uid, name }))));
				return message.reply(getLang("listAdmin", getNames.map(({ uid, name }) => `• ${name} (${uid})`).join("\n")));
			}
        case "on": {              
   config.ownerOnlyMood.enable = true;
                writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));
                return message.reply(getLang("enable"))
            }
            case "off": {
   config.ownerOnlyMood.enable = false;
                writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));
                return message.reply(getLang("disable"))
            }
            default:
                return message.SyntaxError();
        }
    }
};
