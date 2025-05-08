const { GoatWrapper } = require('fca-liane-utils');
const axios = require('axios');
const path = require('path');
const moment = require('moment-timezone');

module.exports = {
config: {
  name: "owner",
  aurthor:"𝗦𝗵𝗔𝗻",// Don't Change I't
   role: 0,
  shortDescription: " ",
  longDescription: "",
  category: "𝗜𝗡𝗙𝗢",
  guide: "{pn}"
},

  onStart: async function ({ api, event }) {
  api.setMessageReaction('😍', event.messageID, (err) => {}, true);
  try {
    const ShanInfo = {
      name: '(╹◡╹)𝐀𝐫𝐚𝐟𝐚𝐭Ψ',
      nick: '𝐀𝐫𝐚𝐟𝐚𝐭',
      gender: '𝑴𝒂𝑳𝒆',
      birthday: '23-11-𝟐𝟎𝟎7',
      age:'17',
      Status: 'আমি বললুম না আমার শরম করে😝🤭',
      hobby: '𝑺𝒍𝒆𝒆𝑷𝒊𝒏𝑮',
      religion: '𝙄𝒔𝒍𝑨𝒎',
      height: '5"3',
      Fb: 'https://www.facebook.com/arafatas602',
      messenger: 'https://m.me/arafat602',
      authorNumber: 'এইটা পার্সোনাল',
      insta: 'https://www.instagram.com/iam_Arafat_602',
      tg: 'https://t.me/arafatas602',
      capcut: 'কোনো আইড়ি নাই , Alight motion ব্যবহার করি।',
      tiktok: 'আমি প্রতিবন্ধী না 🙂',
      youtube: 'নিজের কোনো চ্যানেল নাই ☺️',
    };
    const now = moment().tz('Asia/Jakarta');
    const date = now.format('MMMM Do YYYY');
    const time = now.format('h:mm:ss A');
    const uptime = process.uptime();
    const seconds = Math.floor(uptime % 60);
    const minutes = Math.floor((uptime / 60) % 60);
    const hours = Math.floor((uptime / (60 * 60)) % 24);
    const days = Math.floor(uptime / (60 * 60 * 24));
    const uptimeString = `${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`;

    const ShAn = [
'https://drive.google.com/uc?export=download&id=1J4yQ13L2WTpdOuqcP0yEmzULACdwfvnQ',
'https://drive.google.com/uc?export=download&id=1J2ph0PcizaIy9QnK9790j4jXGBwBSjG7',
'https://drive.google.com/uc?export=download&id=1IxpwGICHS9rt7UkwYbkTO4PlvMn5jG97',
'https://drive.google.com/uc?export=download&id=1Ix3Dumgwq0CieVtSpYhrpR9d32WXrmiV',
'https://drive.google.com/uc?export=download&id=1IqXSVvZtP3a34-sJk_quBTaJz0yxEmr0',
'https://drive.google.com/uc?export=download&id=1IeFbLyT10lgmoFGusHG7iiYennklu8AG',
'https://drive.google.com/uc?export=download&id=1IdK2aYg3Ghea2-GZCEIbGfM0n3pvybCW',
'https://drive.google.com/uc?export=download&id=1IWXtQBd9V5xuLL7-dADTKLoprAE6XrOS',
'https://drive.google.com/uc?export=download&id=1IOW6p0wpC6E8MBv1OfAnG1UWmMKfPw5z',
'https://drive.google.com/uc?export=download&id=1IKA_yxFxPz09116TSmrk-K55DEW3GFB2',
'https://drive.google.com/uc?export=download&id=1IH8zjj-fH5M8hwPrI1i6JfKFRlmy7AyX',
'https://drive.google.com/uc?export=download&id=1IEz8wwc5T5chRzsruT8fETfqJUYTk_1g',
'https://drive.google.com/uc?export=download&id=1I5iOweiVL_aV8W2k3WJqgEHkHD75PY1k',
'https://drive.google.com/uc?export=download&id=1I3Jte-iy8bF4SehZ_EHN-EOeoeJSscEO',
'https://drive.google.com/uc?export=download&id=1I1vfvQnpx6OW9iyM55OGAerAge19bUP4',
'https://drive.google.com/uc?export=download&id=1I0YRd6OzpRHLFM-pqYmoKuDRe9Ldhfht',
'https://drive.google.com/uc?export=download&id=1HyhkBI92QKm3dTq6NJpDhGWKHFKn8iN8',
'https://drive.google.com/uc?export=download&id=1Hy9SmvIJzU5aXbjjGTlEUwCihOWIj6Fk',
'https://drive.google.com/uc?export=download&id=1Hw-0A--3teOH5k9zWsAc85gwGbxgIJJR',
'https://drive.google.com/uc?export=download&id=1HqWwyPkSHp7G_HgcH5bUNOW4nQrlcUFy'
      ]; // Replace with your Google Drive videoid link https://drive.google.com/uc?export=download&id=here put your video id
    const ShaN = ShAn[Math.floor(Math.random() * ShAn.length)];

    const response = `💫《 ⩸__𝐁𝐨𝐭 𝐀𝐧𝐝 𝐎𝐰𝐧𝐞𝐫 𝐈𝐧𝐟𝐨𝐫𝐦𝐚𝐭𝐢𝐨𝐧__⩸ 》💫
\🤖彡𝐵𝑜𝑡 𝑁𝑎𝑚𝑒 : ⩸__${global.GoatBot.config.nickNameBot}__⩸
\👾彡𝐵𝑜𝑡 𝑆𝑦𝑠𝑡𝑒𝑚 𝑃𝑟𝑒𝑓𝑖𝑥 : ${global.GoatBot.config.prefix}
\💙彡𝑂𝑤𝑛𝑒𝑟 𝑁𝑎𝑚𝑒 : ${ShanInfo.name}
\🙆🏻‍♂️彡𝐺𝑒𝑛𝑑𝑒𝑟 : ${ShanInfo.gender}
\😶彡𝐵𝑖𝑟𝑡ℎ𝑑𝑎𝑦 : ${ShanInfo.birthday}
\📝彡𝐴𝑔𝑒  : ${ShanInfo.age}
\💕彡𝑅𝑒𝑙𝑎𝑡𝑖𝑜𝑛𝑆ℎ𝑖𝑝 : ${ShanInfo.Status}
\🐸彡𝐻𝑜𝑏𝑏𝑦 : ${ShanInfo.hobby}
\🕋彡𝑅𝑒𝑙𝑖𝑔𝑖𝑜𝑛 : ${ShanInfo.religion}
\🙎🏻‍♂️彡𝐻𝑖𝑔ℎ𝑡 : ${ShanInfo.hight}
\🌍彡𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝐿𝑖𝑛𝑘 : ${ShanInfo.Fb}
\🌐彡𝑊𝑝 : ${ShanInfo.authorNumber}
\🔖彡𝐼𝑛𝑠𝑡𝑎𝑔𝑟𝑎𝑚 : ${ShanInfo.insta}
\🏷彡️𝑇𝑒𝑙𝑒𝑔𝑟𝑎𝑚 : ${ShanInfo.tg}
\☠彡️𝐶𝑎𝑝𝐶𝑢𝑡 : ${ShanInfo.capcut}
\🤡彡𝑇𝑖𝑘𝑇𝑜𝑘 : ${ShanInfo.tiktok}
\🤐彡𝑌𝑜𝑢𝑇𝑢𝑏𝑒 : ${ShanInfo.youtube}
\🗓彡𝐷𝑎𝑡𝑒 : ${date}
\⏰彡𝑁𝑜𝑤 𝑇𝑖𝑚𝑒 : ${time}
\🔰彡𝐴𝑛𝑦 𝐻𝑒𝑙𝑝 𝐶𝑜𝑛𝑡𝑎𝑐𝑡 :⩸__${ShanInfo.messenger}__⩸
\📛彡𝐵𝑜𝑡 𝐼𝑠 𝑅𝑢𝑛𝑛𝑖𝑛𝑔 𝐹𝑜𝑟 : ${uptimeString}
\===============`;

    await api.sendMessage({
      body: response,
      attachment: await global.utils.getStreamFromURL(ShaN)
    }, event.threadID, event.messageID);
    
  } catch (error) {
    console.error('Error in ownerinfo command:', error);
    return api.sendMessage('An error occurred while processing the command.', event.threadID);
  }
},
};
const wrapper = new GoatWrapper(module.exports);
wrapper.applyNoPrefix({ allowPrefix: true });
