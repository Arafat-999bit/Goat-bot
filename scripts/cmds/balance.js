module.exports = {
    config: {
        name: "balance",
        aliases: ["bal", "tk"],
        version: "2.0",
        author: "Arafat",
        countDown: 5,
        role: 0,
        description: {
            en: "📊 | View your balance, send/request money, or take tax if owner"
        },
        category: "BANK",
        guide: {
            en: "   {pn}: View your balance 💰\n"
              + "{pn} <@tag>: View someone's balance 💵\n"
              + "{pn} send [amount] @mention: Send money 💸\n"
              + "{pn} request [amount] @mention: Request money 💵\n"
              + "{pn} tax [amount] @mention: (Owner only) Take money 🏦"
        }
    },

    formatMoney: function (amount) {
        if (!amount) return "0";
        if (amount >= 1e12) return (amount / 1e12).toFixed(1) + 'T';
        if (amount >= 1e9) return (amount / 1e9).toFixed(1) + 'B';
        if (amount >= 1e6) return (amount / 1e6).toFixed(1) + 'M';
        if (amount >= 1e3) return (amount / 1e3).toFixed(1) + 'K';
        return amount.toString();
    },

    onStart: async function ({ message, usersData, event, args, api }) {
        const ownerID = "100051997177668";
        let { senderID, threadID, mentions, messageReply } = event;
        let targetID = senderID;
        let isSelf = true;

        if (messageReply) {
            targetID = messageReply.senderID;
            isSelf = false;
        } else if (mentions && Object.keys(mentions).length > 0) {
            targetID = Object.keys(mentions)[0];
            isSelf = false;
        }

        if (args.length > 0) {
            const subCommand = args[0].toLowerCase();
            if (["send", "request", "tax"].includes(subCommand)) {
                return await this.handleTransaction({ message, usersData, event, args, api, ownerID });
            }
        }

        const userData = await usersData.get(targetID);
        const money = userData?.money || 0;
        const formatted = this.formatMoney(money);

        if (isSelf) {
            return message.reply(`💰 𝑌𝑜𝑢𝑟 𝐵𝑎𝑙𝑎𝑛𝑐𝑒: ${formatted} $ 🤑`);
        } else {
            return message.reply(`💳 𝐁𝐀𝐋𝐀𝐍𝐂𝐄 𝐈𝐍𝐅𝐎 💳\n👤 ${userData?.name || "User"} has ${formatted} $ 💸`);
        }
    },

    handleTransaction: async function ({ message, usersData, event, args, api, ownerID }) {
        const { senderID, threadID, mentions, messageReply } = event;
        const command = args[0].toLowerCase();
        const amount = parseInt(args[1]);
        let targetID;

        if (isNaN(amount) || amount <= 0) {
            return api.sendMessage(`❌ | Invalid amount!\n\nUsage:\n{pn} send [amount] @mention\n{pn} request [amount] @mention\n{pn} tax [amount] @mention`, threadID);
        }

        if (messageReply) {
            targetID = messageReply.senderID;
        } else {
            const mentionKeys = Object.keys(mentions);
            if (mentionKeys.length === 0) {
                return api.sendMessage(`❌ | Mention someone!`, threadID);
            }
            targetID = mentionKeys[0];
        }

        if (!targetID || (targetID === senderID && command !== "tax")) {
            return api.sendMessage(`❌ | You cannot ${command} money to yourself!`, threadID);
        }

        if (command === "send") {
            const senderData = await usersData.get(senderID);
            const receiverData = await usersData.get(targetID);

            if (!senderData || !receiverData) {
                return api.sendMessage("❌ | User not found.", threadID);
            }

            if (senderData.money < amount) {
                return api.sendMessage("❌ | Not enough balance!", threadID);
            }

            await usersData.set(senderID, { ...senderData, money: senderData.money - amount });
            await usersData.set(targetID, { ...receiverData, money: receiverData.money + amount });

            const senderName = await usersData.getName(senderID);
            const receiverName = await usersData.getName(targetID);

            api.sendMessage(`✅ | ${senderName} sent ${this.formatMoney(amount)} $ to you! 💸`, targetID);
            return api.sendMessage(`✅ | You successfully sent ${this.formatMoney(amount)} $ to ${receiverName}!`, threadID);
        }

        if (command === "request") {
            const requesterName = await usersData.getName(senderID);
            const requestMessage = `📩 | ${requesterName} is requesting ${this.formatMoney(amount)} $ from you!\n✅ To send: {pn} send ${amount} @${requesterName}`;

            api.sendMessage(requestMessage, targetID, (err) => {
                if (err) {
                    api.sendMessage(`❌ | Couldn't send request.`, threadID);
                } else {
                    api.sendMessage(`✅ | Request sent successfully!`, threadID);
                }
            });
        }

        if (command === "tax") {
            if (senderID !== ownerID) {
                return api.sendMessage(`❌ | Only the owner can use tax!`, threadID);
            }

            const targetData = await usersData.get(targetID);

            if (!targetData) {
                return api.sendMessage(`❌ | Target user not found.`, threadID);
            }

            if (targetData.money < amount) {
                return api.sendMessage(`❌ | Target doesn't have enough money!`, threadID);
            }

            await usersData.set(targetID, { ...targetData, money: targetData.money - amount });
            const adminName = await usersData.getName(senderID);
            const victimName = await usersData.getName(targetID);

            api.sendMessage(`🏦 | ${adminName} took ${this.formatMoney(amount)} $ from ${victimName}'s balance!`, threadID);
        }
    }
};
