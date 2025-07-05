module.exports.config = {
  name: "dogay",
  version: "1.1.2",
  hasPermission: 0,
  credits: "HÌNH ẢNH THÀNH VĂN BẢN + update by ChatGPT",
  description: "Đo độ gay và cà khịa có tag, thính tấu hài cực mạnh",
  commandCategory: "Tiện ích",
  cooldowns: 5
};

module.exports.run = function({ api, event }) {
  const gayPercent = Math.floor(Math.random() * 101); // 0 - 100%
  let level = "";

  if (gayPercent < 20) level = "Thằng như dây điện cao thế ⚡";
  else if (gayPercent < 40) level = "Cũng hơi cong rồi đó nha 👀";
  else if (gayPercent < 60) level = "Không thẳng mà cũng không cong... 🤨";
  else if (gayPercent < 80) level = "Cong thiệt rồi đó nha ái~ 💅";
  else level = "Full combo cầu vồng 🌈 Supreme Edition!";

  const roasts = [
      "Gay tới mức đi ngoài cũng thấy cầu vồng 🌈",
      "Thẳng như đường cong của trái tim bạn dành cho trai 🫠",
      "Điểm gay cao hơn điểm thi đại học của bạn 🎓🌈",
      "Cong còn hơn đường cong lãi suất ngân hàng 📉",
      "Trai thẳng mà thấy bạn còn phải suy nghĩ lại 👬",
      "Mỗi lần bạn cười là thêm một thằng dính thính 🤤",
      "Không cần test đâu, đi Pride luôn cho lẹ 🏳️‍🌈",
      "Chữa bệnh cong của bạn chắc phải dùng máy uốn sắt 🔧",
      "Gay đến độ ánh mắt cũng có đường cong riêng 👁️",
      "NASA bảo đường cong bạn tạo ra làm lệch quỹ đạo vệ tinh 🚀"
  ];

  const randomRoast = roasts[Math.floor(Math.random() * roasts.length)];

  // Lấy người được tag hoặc reply hoặc chính sender
  const tagID = event.type === "message_reply"
      ? event.messageReply.senderID
      : (event.mentions && Object.keys(event.mentions).length > 0
          ? Object.keys(event.mentions)[0]
          : event.senderID);

  const tagName = event.type === "message_reply"
      ? "người bạn vừa reply"
      : (event.mentions && Object.values(event.mentions)[0]?.replace(/@/g, '') || "bạn");

  const msg = `🌈 Độ gay của ${tagName} là: ${gayPercent}%\n📊 ${level}\n😂 ${randomRoast}`;

  return api.sendMessage({
      body: msg,
      mentions: [{
          id: tagID,
          tag: tagName
      }]
  }, event.threadID, event.messageID);
};
