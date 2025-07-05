module.exports.config = {
  name: "dodeptrai",
  version: "1.1.2",
  hasPermission: 0,
  credits: "HÌNH ẢNH THÀNH VĂN BẢN + ChatGPT",
  description: "Đo độ đẹp trai và thả thính có tag",
  commandCategory: "Tiện ích",
  cooldowns: 5
};

module.exports.run = function({ api, event }) {
  const handsomeRate = Math.floor(Math.random() * 100) + 1; // 1 - 100%

  const insults = [
      "Đẹp trai kiểu này chắc cần bảo trì lại nhan sắc đó 🫠",
      "Gương vỡ còn lành, nhan sắc bạn vỡ là vỡ luôn 😵",
      "Đẹp trai không thấy, chỉ thấy trời đang thử thách người đối diện 😩",
      "Gọi bạn là bóng đèn vì chỉ sáng được mỗi khi... cúp điện 💡",
      "Nhìn bạn xong, AI cũng không nhận diện nổi là người hay pixel 🤖"
  ];

  const compliments = [
      "Đẹp trai như này thì chắc là sản phẩm lỗi của thiên thần rồi 😍",
      "Góc nghiêng thần thánh quá, chắc ông trời chỉnh góc cho riêng 🥰",
      "Đẹp trai tới mức trái tim người ta phải tăng tốc đập 120bpm 💓",
      "Vẻ đẹp bạn mang theo khiến Google muốn tra cứu nguồn gốc 👑",
      "Đẹp kiểu này mà không crush là tội ác với nhân loại 😘"
  ];

  // Lấy người được tag (reply/mention) hoặc chính sender
  const tagID = event.type === "message_reply"
      ? event.messageReply.senderID
      : (event.mentions && Object.keys(event.mentions).length > 0
          ? Object.keys(event.mentions)[0]
          : event.senderID);

  const tagName = event.type === "message_reply"
      ? "người bạn vừa reply"
      : (event.mentions && Object.values(event.mentions)[0]?.replace(/@/g, '') || "bạn");

  const message = `📸 Độ đẹp trai của ${tagName} là: ${handsomeRate}%`;

  let flirtLine = "";

  if (handsomeRate < 50) {
      flirtLine = insults[Math.floor(Math.random() * insults.length)];
  } else {
      flirtLine = compliments[Math.floor(Math.random() * compliments.length)];
  }

  return api.sendMessage({
      body: `${message}\n💬 ${flirtLine}`,
      mentions: [{
          id: tagID,
          tag: tagName
      }]
  }, event.threadID, event.messageID);
};
