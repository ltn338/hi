module.exports.config = {
  name: "daily",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Mirai Team (sửa bởi ChatGPT)",
  description: "Nhận tiền mỗi ngày",
  commandCategory: "Kinh tế",
  cooldowns: 5,
  envConfig: {
    cooldownTime: 86400000, // 24 giờ
    rewardCoin: 1000000 // 1 triệu VND
  }
};

module.exports.languages = {
  "vi": {
    "cooldown": "⏳ Bạn đã nhận hôm nay rồi. Vui lòng quay lại sau: %1 giờ %2 phút %3 giây!",
    "rewarded": "🎉 Bạn đã nhận %1 VND. Quay lại sau 24 giờ để nhận tiếp!"
  },
  "en": {
    "cooldown": "You already claimed today's reward. Try again in: %1h %2m %3s.",
    "rewarded": "You received %1 VND. Come back in 24 hours for the next reward!"
  }
};

module.exports.run = async ({ event, api, Currencies, getText }) => {
  const { threadID, senderID } = event;
  const { rewardCoin, cooldownTime } = global.configModule.daily || {
    rewardCoin: 1000000,
    cooldownTime: 86400000
  };

  console.log(`📥 [DAILY] Lệnh được gọi bởi: ${senderID}`);

  try {
    const userData = await Currencies.getData(senderID);
    const data = userData.data || {};
    const now = Date.now();
    const lastClaim = data.dailyCoolDown || 0;

    if (now - lastClaim < cooldownTime) {
      const timeLeft = cooldownTime - (now - lastClaim);
      const hours = Math.floor(timeLeft / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
      const seconds = Math.floor((timeLeft / 1000) % 60);
      const msg = getText("cooldown", hours, minutes, seconds);
      return api.sendMessage(msg, threadID);
    }

    // Thực hiện cộng tiền và lưu lại thời gian nhận
    await Currencies.increaseMoney(senderID, rewardCoin);
    data.dailyCoolDown = now;
    await Currencies.setData(senderID, { data });

    const rewardMsg = getText("rewarded", rewardCoin.toLocaleString("vi-VN"));
    console.log(`✅ [DAILY] Cộng ${rewardCoin} VND cho: ${senderID}`);
    return api.sendMessage(rewardMsg, threadID);

  } catch (err) {
    console.error("❌ [DAILY] Lỗi:", err);
    return api.sendMessage("⚠️ Đã xảy ra lỗi khi xử lý lệnh /daily.", threadID);
  }
};
