module.exports.config = {
  name: "stk",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "Thanh Nghia",
  description: "Hiển thị thông tin STK + mã QR đẹp",
  commandCategory: "Tiện ích",
  usages: "",
  cooldowns: 5
};

module.exports.run = async function({ api, event }) {
  const { threadID, messageID, senderID } = event;
  const { config } = global;

  // ✅ Kiểm tra quyền admin bot
  if (!config.ADMINBOT.includes(senderID)) {
    return api.sendMessage("⚠️ Lệnh này chỉ dành cho admin bot!", threadID, messageID);
  }

  const axios = require("axios");
  const fs = require("fs-extra");

  // ✅ Link ảnh QR
  const imgUrl = "https://i.postimg.cc/wBsJ07mN/IMG-2504.jpg";
  const path = __dirname + "/cache/stkqr.jpg";

  // ✅ Nội dung tin nhắn
  const msg = `💳 𝗟𝗘 𝗧𝗛𝗔𝗡𝗛 𝗡𝗚𝗛𝗜𝗔\n🏦 𝗦𝗧𝗞: 5127032006\n💠 𝗕𝗔𝗡𝗞: MSB (VIETQR - NAPAS 247)\n📌 Quét mã QR để chuyển khoản`;

  try {
    const res = await axios.get(imgUrl, { responseType: "arraybuffer" });
    fs.writeFileSync(path, Buffer.from(res.data, "binary"));

    return api.sendMessage({
      body: msg,
      attachment: fs.createReadStream(path)
    }, threadID, () => fs.unlinkSync(path), messageID);

  } catch (err) {
    console.error(err);
    return api.sendMessage("❌ Không thể tải ảnh QR. Vui lòng thử lại sau.", threadID, messageID);
  }
};
