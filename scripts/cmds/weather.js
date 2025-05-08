const axios = require("axios");

module.exports = {
  config: {
    name: "weather",
    aliases: ["আবহাওয়া"],
    version: "1.3",
    author: "Arafat Da",
    countDown: 5,
    role: 0,
    shortDescription: {
      bn: "আবহাওয়া ও সূর্য উঠা/অস্তের সময় দেখাও"
    },
    longDescription: {
      bn: "তোমার শহরের বর্তমান তাপমাত্রা, আবহাওয়া, সূর্য উঠা ও অস্ত যাওয়ার সময় এবং দিন/রাতের দৈর্ঘ্য দেখাও।"
    },
    category: "utility",
    guide: {
      bn: "{pn} শহরের_নাম (যেমন: {pn} খুলনা)"
    }
  },

  onStart: async function ({ api, event, args }) {
    const location = args.join(" ");
    if (!location) return api.sendMessage("⚠️ অনুগ্রহ করে একটি শহরের নাম দিন।\nউদাহরণ: #weather বরিশাল", event.threadID);

    const apiKey = "3fa5f106e4mshb0e1d52c96b1b65p1cf890jsn0031aaf5e24f";
    const host = "weatherapi-com.p.rapidapi.com";

    try {
      const [currentRes, astronomyRes] = await Promise.all([
        axios.get(`https://${host}/current.json?q=${encodeURIComponent(location)}`, {
          headers: {
            "X-RapidAPI-Key": apiKey,
            "X-RapidAPI-Host": host
          }
        }),
        axios.get(`https://${host}/astronomy.json?q=${encodeURIComponent(location)}`, {
          headers: {
            "X-RapidAPI-Key": apiKey,
            "X-RapidAPI-Host": host
          }
        })
      ]);

      const current = currentRes.data.current;
      const loc = currentRes.data.location;
      const astro = astronomyRes.data.astronomy.astro;

      // Sunrise & Sunset Duration Calculation
      const [sunriseHour, sunriseMinute] = astro.sunrise.split(" ")[0].split(":").map(Number);
      const [sunsetHour, sunsetMinute] = astro.sunset.split(" ")[0].split(":").map(Number);
      const sunriseAmPm = astro.sunrise.split(" ")[1];
      const sunsetAmPm = astro.sunset.split(" ")[1];

      const sunrise24 = sunriseHour % 12 + (sunriseAmPm === "PM" ? 12 : 0);
      const sunset24 = sunsetHour % 12 + (sunsetAmPm === "PM" ? 12 : 0);

      const sunriseDate = new Date(0, 0, 0, sunrise24, sunriseMinute);
      const sunsetDate = new Date(0, 0, 0, sunset24, sunsetMinute);
      const durationMs = sunsetDate - sunriseDate;
      const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
      const durationMinutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

      const message = 
`📍 শহর: ${loc.name}, ${loc.country}
--------------------------------
🌡️ তাপমাত্রা: ${current.temp_c}°C
🌤️ আবহাওয়া: ${current.condition.text}
💨 বাতাসের গতি: ${current.wind_kph} কিমি/ঘণ্টা
💧 আর্দ্রতা: ${current.humidity}%
🌅 সূর্য উঠবে: ${astro.sunrise}
🌇 সূর্য অস্ত যাবে: ${astro.sunset}
🕒 দিনের দৈর্ঘ্য: ${durationHours} ঘণ্টা ${durationMinutes} মিনিট
📅 সর্বশেষ আপডেট: ${current.last_updated}`;

      return api.sendMessage(message, event.threadID);

    } catch (error) {
      console.error(error);
      return api.sendMessage("❌ দুঃখিত, আবহাওয়ার তথ্য আনতে পারিনি।\nশহরের নামটি সঠিক আছে কিনা চেক করো।", event.threadID);
    }
  }
};
