module.exports = {
 config: {
	 name: "prefix2",
	 version: "1.0",
	 author: "𝗦𝗵𝗔𝗻",//remodified by cliff
	 countDown: 5,
	 role: 0,
	 shortDescription: "no prefix",
	 longDescription: "no prefix",
	 category: "auto 🪐",
 },

 onStart: async function(){}, 
 onChat: async function({ event, message, getLang }) {
 if (event.body && event.body.toLowerCase() === "prefix") {
 return message.reply({
 body: `
Yo, my prefix is [ 𓆩 # 𓆪 ]\n
𝗦𝗢𝗠𝗘 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦 𝗧𝗛𝗔𝗧 𝗠𝗔𝗬 𝗛𝗘𝗟𝗣 𝗬𝗢𝗨:
➥ 𝙊𝙒𝙉𝙀𝙍: ~𝐀𝐫𝐚𝐟𝐚𝐭
➥ ✓sim [bby] -> talk to bot
➥ ✓callad [message] -> report any problem encountered
➥ ✓help -> usage of command\n\nHave fun using it enjoy!❤️\nBot Developer:https://www.facebook.com/arafatas602`,
 attachment: await global.utils.getStreamFromURL("https://i.imgur.com/M4luPbE.gif")
 });
 }
 }
}
