const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: `cdp`,
  version: "1.1.0",
  permission: 0,
  credits: "cyyydev",
  description: "",
  prefix: false,
  premium: false,
  category: "without prefix",
  usage: ``,
  cooldowns: 3,
  dependency: {
    "axios": ""
  }
};

module.exports.run = async function ({ api, event }) {
  try {
    const apiUrl = "https://api.joshweb.click/cdp";
    api.sendMessage("Fetching image..", event.threadID);

    const response = await axios.get(apiUrl);
    const imageUrls = response.data.result;

    const imagePaths = [];
    const imageKeys = Object.keys(imageUrls);

    for (const key of imageKeys) {
      const imageUrl = imageUrls[key];
      const imageResponse = await axios.get(imageUrl, { responseType: "arraybuffer" });
      const imagePath = path.join(__dirname, `${key}.jpeg`);
      fs.writeFileSync(imagePath, imageResponse.data);
      imagePaths.push(imagePath);
    }

    const attachments = imagePaths.map((imagePath) => fs.createReadStream(imagePath));

    api.sendMessage(
      {
        body: "Here is your request!",
        attachment: attachments,
      },
      event.threadID,
      () => {
        imagePaths.forEach((imagePath) => fs.unlinkSync(imagePath));
      }
    );
  } catch (error) {
    console.error("Error:", error);
    api.sendMessage("An error occurred while fetching the images.", event.threadID);
  }
};
