module.exports.config = {
  name: "xinloivk",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Le Thanh - Vợ Chọc Chồng Edition",
  description: "Xin lỗi vợ kiểu hài hước chọc tức thêm",
  commandCategory: "tình yêu",
  usages: "[tên vợ nếu có]",
  cooldowns: 3
};

module.exports.run = async function ({ api, event, args }) {
  const name = args.join(" ") || "vợ yêu";

  const sarcasticApologies = [
    `🥲 Anh xin lỗi vợ… vì anh sai, còn vợ thì luôn đúng… ngay cả khi vợ sai, vẫn đúng 😑`,
    `🤡 Anh xin lỗi vì đã nói quá nhiều… nhưng mà do vợ nói ít nên anh phải nói bù thôi 🤭`,
    `🫣 Vợ ơi, tha lỗi cho anh đi… không thì tối nay anh qua nhà mẹ ngủ, khỏi phải rửa chén luôn 😌`,
    `🤣 Anh biết anh sai rồi… sai vì chưa kịp chụp ảnh lúc vợ nổi giận để làm sticker xài dần 😝`,
    `🐶 Anh xin lỗi vì hôm qua đã lỡ quên rửa chén… nhưng tại anh đang bận mơ thấy vợ kêu đi ăn ngoài 😅`,
    `😎 Em giận là đúng… nhưng giận hoài nhìn em dễ thương quá nên anh chưa muốn dỗ đâu 😏`,
    `💅 Xin lỗi vợ nha, nhưng mà vợ giận xong thì nấu cơm vẫn ngon, yêu vợ ghê á~`,
    `😆 Vợ ơi, giận nữa đi cho đáng tiền năn nỉ, chứ anh mới có 1 bài xin lỗi sẵn rồi chưa xài 😜`,
    `🙃 Em cứ giận đi… vì em giận thì anh mới có cớ để… được im lặng 1 hôm hưởng thái bình 😌`,
    `😇 Anh xin lỗi… vì đã quá đẹp trai nên đôi khi... không nghe rõ vợ nói gì hết trơn 🤪`
  ];

  const msg = sarcasticApologies[Math.floor(Math.random() * sarcasticApologies.length)];

  return api.sendMessage(msg, event.threadID, event.messageID);
};
