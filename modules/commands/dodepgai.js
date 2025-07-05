module.exports.config = {
  name: "dodepgai",
  version: "1.0.0",
  hasPermission: 0,
  credits: "HÌNH ẢNH THÀNH VĂN BẢN + ChatGPT",
  description: "Đo độ đẹp gái và thính theo phần trăm kèm tag",
  commandCategory: "Tiện ích",
  cooldowns: 5
};

module.exports.run = function({ api, event }) {
  const beautyPercent = Math.floor(Math.random() * 100) + 1;

  const jokes = [
      "Đẹp gái kiểu này chắc là nhân vật phản diện trong phim hoạt hình 😵",
      "Gái xinh trong truyền thuyết chắc đang xin lỗi vì để bạn đại diện nhan sắc 😅",
      "Nhìn bạn xong, camera an ninh cũng tự blur lại cho đỡ sợ 📸",
      "Bạn không cần trang điểm đâu, vì make up cũng xin phép né bạn 🧽",
      "Nhan sắc này mà đi thi hoa hậu chắc đoạt... giải khuyến khích an ủi 🫣"
  ];

  const compliments = [
      "Đẹp gái cỡ này chắc được thiên thần gửi nhầm xuống trần gian rồi 😍",
      "Nhìn em một phát là Windows cũng đứng hình mất vài giây 💻❤️",
      "Nhan sắc này mà đi chợ chắc được giảm giá vì làm rạng rỡ khu phố 😘",
      "Đẹp gái vậy ai không đổ thì chắc... hư mắt mất rồi 🥵",
      "Người ta nói hoa hậu là nhất, chắc chưa gặp em thôi 💐"
  ];

  // Xác định người bị tag
  const tagID = event.type === "message_reply"
      ? event.messageReply.senderID
      : (event.mentions && Object.keys(event.mentions).length > 0
          ? Object.keys(event.mentions)[0]
          : event.senderID);

  const tagName = event.type === "message_reply"
      ? "người bạn vừa reply"
      : (event.mentions && Object.values(event.mentions)[0]?.replace(/@/g, '') || "bạn");

  const msg = `💃 Độ đẹp gái của ${tagName} là: ${beautyPercent}%`;

  const finalLine = beautyPercent < 50
      ? jokes[Math.floor(Math.random() * jokes.length)]
      : compliments[Math.floor(Math.random() * compliments.length)];

  return api.sendMessage({
      body: `${msg}\n💬 ${finalLine}`,
      mentions: [{
          id: tagID,
          tag: tagName
      }]
  }, event.threadID, event.messageID);
};
