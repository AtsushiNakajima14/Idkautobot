const axios = require("axios");

module.exports.config = {
  name: "llama",
  version: "1.1.0",
  permission: 0,
  credits: "Cyyy",
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

module.exports.run = async function ({ api, event, args }) {
  try {
    let q = args.join(" ");
    if (!q) {
      return api.sendMessage("Please provide a question..", event.threadID, event.messageID);
    }

    api.sendMessage("Processing query...", event.threadID, async (err, info) => {
      if (err) {
        console.error("Error sending initial message:", err);
        return api.sendMessage("An error occurred while processing your request.", event.threadID);
      }

      try {
        const userInfo = await api.getUserInfo(event.senderID);
        const senderName = userInfo[event.senderID].name;

        const response = await axios.get(
          `https://api.joshweb.click/ai/llama-3-8b?q=${encodeURIComponent(q)}&uid=100`
        );
        const answer = response.data.result;

        const finalMessage = `Llama 3 CONTINUES AI\n━━━━━━━━━━━━━━━━━━\n${answer}\n━━━━━━━━━━━━━━━━━━\nQuestioned by: ${senderName}\n━━━━━━━━━━━━━━━━━━\nType llama clear to reset your previous chats`;
        api.sendMessage(finalMessage, event.threadID);
      } catch (error) {
        console.error("Error fetching AI response or user info:", error);
        api.sendMessage("An error occurred while processing your request.", event.threadID);
      }
    });
  } catch (error) {
    console.error("Error in ai command:", error);
    api.sendMessage("An error occurred while processing your request. Kindly double check API.", event.threadID);
  }
};
