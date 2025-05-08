module.exports = {
  config: {
    name: "girlsvideo",
    aliases: ["girls"],
    version: "2.0",
    author: "𝗦𝗵𝗔𝗻",
    countDown: 20,
    role: 0,
    shortDescription: "",
    longDescription: "send you a hot girl video",
    category: "18+",
    guide: "{p}{n}",
  },

  sentVideos: [],

  onStart: async function ({ api, event, message }) {
    
    const senderID = event.senderID;

    const loadingMessage = await message.reply({
      body: "কিরে লুচ্চা 🤨 দারা দিতেছি 😜",
    });

    const link = [
"https://drive.google.com/uc?export=download&id=12PMfrf5d0ahx0e2fvfN4XB3G1hi7SusZ",
"https://drive.google.com/uc?export=download&id=12BOEV1OOgz464trZMHeoWv9YkW9L2TAj",
"https://drive.google.com/uc?export=download&id=127TkJBb_JGlQAnQZx-YUnPdrS44Zqbit",
"https://drive.google.com/uc?export=download&id=123TkMiNLbdM-slGRJH91n7644581N6iq",
"https://drive.google.com/uc?export=download&id=11yPbAh91wXOQKFlt8cgobtbhds6TVyaM",
"https://drive.google.com/uc?export=download&id=11v1OfIiPBQrcdZ7W1cbCi9c39EMcYKNa",
"https://drive.google.com/uc?export=download&id=11rRNHTGXtxaXzVBwwCskD32Plz36aURA",
"https://drive.google.com/uc?export=download&id=11j4jeDHyGYk9U9wYZwOsZ7kaqC_LaNuZ",
"https://drive.google.com/uc?export=download&id=11hHWOCEnXKt487BB3VGUyrDZUbEzFC1u",
"https://drive.google.com/uc?export=download&id=11bOEFD1tR0ghd5gtvi13tUH_Po5fP9Vd",
"https://drive.google.com/uc?export=download&id=11_QWypd1_xBAjQqhNPJVTztT8YfM0XUk",
"https://drive.google.com/uc?export=download&id=11XkBBzvie9NYLDv2in-zOkeRhD0KhPp2",
"https://drive.google.com/uc?export=download&id=11KTXSIphB5yAgTghH3A7rgYlA3Tsvj0Q",
"https://drive.google.com/uc?export=download&id=11GrORwj8XFCr3HMfz3-gDShU0Yg9VUj5",
"https://drive.google.com/uc?export=download&id=11794HSvw0YyK6ZlW2F4ZC26UMyZZYhz-",
"https://drive.google.com/uc?export=download&id=10nuCjUGGC8QNjBdp9-o0T8j4wS_5RuMe",
"https://drive.google.com/uc?export=download&id=10lkeOuBpk4skzXFSkiZgJEbzGoHh6X74",
"https://drive.google.com/uc?export=download&id=10YcDTSivgze6jKdrvIcwaT4m65GuQdJf",
"https://drive.google.com/uc?export=download&id=1D8FSQsPqAn3Q80oY5oMdn0yOwAT5oVjr",
"https://drive.google.com/uc?export=download&id=1D-LlD6vyDHosuiuqKm4tpTwMz8-peaaC",
"https://drive.google.com/uc?export=download&id=1Cyc_Qo_t-5m317wqVHF5zrhSrU5WVM9e",
"https://drive.google.com/uc?export=download&id=1Cx93Drug-dusS1fIPPtNXsmrnNC-SnLD",
"https://drive.google.com/uc?export=download&id=1CwN8Ss_95hfkrqj5vUJ2oBj66u0IwmRB",
"https://drive.google.com/uc?export=download&id=1Cw39gw1yVN4iywnC-4G00xAXBC42M_Ab",
"https://drive.google.com/uc?export=download&id=1CuMPm0ylZhjbHDITaR-NCMXhRBS2_4Bu",
"https://drive.google.com/uc?export=download&id=1CvFpG-dWCyZYI7rQXPjGLSKh3fJEN9tX",
"https://drive.google.com/uc?export=download&id=1Crv4pjlpJ49BaaxXHkXp3sPQIcyk4tK4",
"https://drive.google.com/uc?export=download&id=1CrSech99q-km4UrNhflRrq0ytszy_ztB",
"https://drive.google.com/uc?export=download&id=1CdQqUra1cvUvN4yZO0vtR5S13dPgo01P",
"https://drive.google.com/uc?export=download&id=1CVYU-TFnNDmNpy93EQVQujKzKmUyEywQ",
"https://drive.google.com/uc?export=download&id=1CTa3S4iXZ7mpxld5cGAA4O8XdZl9eyEU",
"https://drive.google.com/uc?export=download&id=1CJRt3KeFCt6wlKLz3cxXtbO4qrBleBAY",
"https://drive.google.com/uc?export=download&id=1CGqt-kHBjeWIPBoWpbgsXzqBE85qnWfB",
"https://drive.google.com/uc?export=download&id=1CDqdDkqzDLTJ1yrD_yd-1raBxHLs7xgg",
"https://drive.google.com/uc?export=download&id=1CCBaMRCfp5T4Q6PRRfUOPUgmrtMOpsv3",
"https://drive.google.com/uc?export=download&id=1C6wd2V-LYDxs-OPsY9igItetqtX2Aj2_",
"https://drive.google.com/uc?export=download&id=1C0lq8_4Mf8z_wYuJbQrmNLn_MVqQck-q",
"https://drive.google.com/uc?export=download&id=1BtS8FE1XNvZ6hoJATlVEB29XGj0-GtTu",
"https://drive.google.com/uc?export=download&id=16HuQeuPLsfMcXLITNOJSBVJewHmXk8Ru",
"https://drive.google.com/uc?export=download&id=16BJpSk2zk7Uy9DxLxbwFkEW9uDXsYzlB",
"https://drive.google.com/uc?export=download&id=17by8dS0pQY4d1tIJIsoaeAuRvATiGywY",
"https://drive.google.com/uc?export=download&id=16U0pk5Z1xSK1noxppaBSVoWABeLtu4RG",
"https://drive.google.com/uc?export=download&id=15mNY62pGLPq7W_Uly5IBi0dd9YHzWyWc",
"https://drive.google.com/uc?export=download&id=15PMxc-gznm4Ona3fZLPTs7Yj3kOfx0Wf",
"https://drive.google.com/uc?export=download&id=16I-YJcYmNOBHWath6Y86F44d7e_ofe7J",
"https://drive.google.com/uc?export=download&id=17Udy1YF9M0f6kVkTY_I2s_Lgy3iXheuj",
"https://drive.google.com/uc?export=download&id=16sM1E35-ua6qAKfSnnGlIAQQmb4bqgRD",
"https://drive.google.com/uc?export=download&id=15qhYDHsVznBZVyBniyNlECYovVnLgiBV",
"https://drive.google.com/uc?export=download&id=16Eg73csaToVbQ0lz_hDxk8L6sKjSLvgd",
"https://drive.google.com/uc?export=download&id=17zX7xULbhcYDtfjZwcSfb8esrAH8ePwY",
"https://drive.google.com/uc?export=download&id=17bx6rdpZo4SEiSeiMpI_asDXbazTBdTg",
"https://drive.google.com/uc?export=download&id=15uZpBBRBijJxYifQgsNtme13SvyiBvVj",
"https://drive.google.com/uc?export=download&id=16TeBkjBYYtT19mjBgmghIF4Ts8Rj2EaP",
"https://drive.google.com/uc?export=download&id=17mM28fnOWAybglrog-ZnAb-qLI9mqljX",
"https://drive.google.com/uc?export=download&id=16HTIuH9ReUiU6PvQ5150VjiXl5qRub_E",
"https://drive.google.com/uc?export=download&id=168IpCjTPNP97LCCJhOdf06OUTzbt1Dgn",
"https://drive.google.com/uc?export=download&id=172G7rebE1EiEbxk7WmUQTqEA-JhokpHY",
"https://drive.google.com/uc?export=download&id=17fFHNzH1pYhJGFLvpJA0K-ARht8twPFH",
"https://drive.google.com/uc?export=download&id=168KgKWLMVQRDPWtU0KKc09EFuhfXPmEg",
"https://drive.google.com/uc?export=download&id=16ogQkb5pU83btZxJuK6vEcK5Z1R8XEr3",
"https://drive.google.com/uc?export=download&id=17SQOC--BT2tYJOcLYHA6pLr9u0yRSBc5",
"https://drive.google.com/uc?export=download&id=170WOkxswt5Zi_JbUS3HL2Z9tdUco6llL",
"https://drive.google.com/uc?export=download&id=176b9bbWNc8Pk37c-gfn3RWV1V1ycXsuK",
"https://drive.google.com/uc?export=download&id=15YUyugeHbZGPOwPv_hNgbgLGyx11bMMa",
"https://drive.google.com/uc?export=download&id=16qxAxXFGXTSeI-yxroyAcK5J9C8xovbL",
"https://drive.google.com/uc?export=download&id=16_-J9PjHk5kw1Cn4QlJbCzRUM2GEF0H6",
"https://drive.google.com/uc?export=download&id=16matvWMeSMjePiue8zUtGKrjCzRLcYoO",
"https://drive.google.com/uc?export=download&id=16-9DhekS3frUC3nXL_gQ5ilP8-QdMjK7",
"https://drive.google.com/uc?export=download&id=16zI3y_YZhxkZdztOTlmmni08fFm3yY8r",
"https://drive.google.com/uc?export=download&id=17S9mhKKn4BCkc3fzeny3UFvRPrC39JRd",
"https://drive.google.com/uc?export=download&id=15DZnoyssXYUvG6VUrhOKQfkunOB3DDWZ",
"https://drive.google.com/uc?export=download&id=176e7iQND8XV_vyz7vA8dlZ3bdghVekDK",
"https://drive.google.com/uc?export=download&id=16fxEZu9t-8RuuTEB5HJtjQO_E4jfe66L",
"https://drive.google.com/uc?export=download&id=15l-YEUg-E_J9JlH73wZWN9FHeSTQwceX",
"https://drive.google.com/uc?export=download&id=17XeHrfGFeCRDNx7xFJT1NHlvtyEQmGU5",
"https://drive.google.com/uc?export=download&id=17LkXkBhUMFHOW5qFKfvXdJvNlZ24vDfz",
"https://drive.google.com/uc?export=download&id=15r55bWoRJpE7RT9rltPIT438gMIEnjB3",
"https://drive.google.com/uc?export=download&id=17r05O7YYrp213wv_X1AG3iOlWhbwpETr",
"https://drive.google.com/uc?export=download&id=1AZJ1Y7XFSzVPG7qntx3SV4i5AUw06QH6",
"https://drive.google.com/uc?export=download&id=1Ab9EOmObvaxZCuuGprctkWf523lGGq3C"
  ];

    const availableVideos = link.filter(video => !this.sentVideos.includes(video));

    if (availableVideos.length === 0) {
      this.sentVideos = [];
    }

    const randomIndex = Math.floor(Math.random() * availableVideos.length);
    const randomVideo = availableVideos[randomIndex];

    this.sentVideos.push(randomVideo);

    if (senderID !== null) {
      message.reply({
        body: 'এই নে বোকাচুলা দেখ 🥵💦',
        attachment: await global.utils.getStreamFromURL(randomVideo),
      });

      setTimeout(() => {
        api.unsendMessage(loadingMessage.messageID);
      }, 30000);
    }
  },
};
