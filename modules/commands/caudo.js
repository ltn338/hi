module.exports.config = {
  name: "caudo",
  version: "1.2.0",
  hasPermission: 0,
  credits: "HÌNH ẢNH THÀNH VĂN BẢN + ChatGPT",
  description: "Câu đố 18+ dâm dâm tấu hài, không tục",
  commandCategory: "Giải trí",
  cooldowns: 5
};

module.exports.run = function({ api, event }) {
  const quiz = [
      { question: "🍌 Cái gì dài, đàn ông có, phụ nữ thích ngậm?", answer: "Bàn chải đánh răng" },
      { question: "💦 Khi ướt thì em ở trong, khi khô thì em ra ngoài. Em là gì?", answer: "Khăn tắm" },
      { question: "🍆 Đàn ông giơ lên, phụ nữ ngồi xuống là thấy sướng. Là gì?", answer: "Chiếc ghế" },
      { question: "🍑 Có cái lỗ nào mà ai cũng thích đưa tay vào rồi xoay xoay không?", answer: "Ổ khoá" },
      { question: "🍌 Cái gì càng kéo ra càng dài, càng nhét vô càng sướng?", answer: "Dây kéo vali" },
      { question: "👅 Cái gì lúc nào cũng ướt mà cứ ra vào liên tục?", answer: "Lưỡi trong miệng" },
      { question: "🤤 Đàn ông đút vào, phụ nữ kẹp lại. Là gì?", answer: "Dây nịt (thắt lưng)" },
      { question: "🥵 Ban ngày thì cứng, ban đêm thì mềm. Là gì?", answer: "Bàn học" },
      { question: "🫦 Cái gì có 2 mép, ướt và rung khi động vào?", answer: "Đôi môi" },
      { question: "🛏 Thứ gì càng đập càng sướng, mà không phải ai cũng được đập?", answer: "Gối ôm" },
      { question: "🔧 Vừa xoay vừa vặn, càng siết càng cứng. Là gì?", answer: "Bu lông" },
      { question: "🧤 Cái gì lồng vào tay mà ấm áp cả đêm?", answer: "Bao tay" },
      { question: "🩳 Đàn ông mặc mỗi ngày, phụ nữ thích kéo xuống?", answer: "Quần" },
      { question: "🍯 Có cái hũ nào mà ai cũng muốn múc nhưng lại hay bị đổ?", answer: "Hũ mật ong" },
      { question: "😶 Cái gì có đầu không cổ, có cổ không miệng?", answer: "Cổ chai" },
      { question: "🧦 Cái gì mềm mềm, đi vào là ấm, cởi ra là lạnh?", answer: "Đôi tất" },
      { question: "📦 Cái gì càng nhét vô càng đầy, càng lắc càng kêu?", answer: "Hộp quà" },
      { question: "🔩 Cái gì có ren, xoay nhẹ là khớp?", answer: "Vít vặn" },
      { question: "🥒 Cái gì to hơn dưa leo, mềm hơn dưa chuột mà vẫn làm người ta đỏ mặt?", answer: "Gối ôm hình dưa" },
      { question: "📏 Thứ gì đo chiều dài mà không phải thước?", answer: "Thước dây" },
      { question: "🧽 Cái gì vừa bóp là ướt, càng bóp càng ra nước?", answer: "Miếng rửa chén" },
      { question: "🍦 Cái gì vừa liếm vừa tan, ai cũng mê mà không béo?", answer: "Kem" },
      { question: "📎 Cái gì kẹp lại cho chắc, nhưng tháo ra lại dễ?", answer: "Kẹp giấy" },
      { question: "👖 Cái gì nằm giữa 2 chân, cởi ra ai cũng ngại?", answer: "Khóa quần" },
      { question: "🪠 Cái gì mềm ở đầu, cứng ở thân, đưa vô lỗ mới sạch?", answer: "Cây thụt bồn cầu" },
      { question: "🔑 Cái gì vừa đút vào lỗ đã xoay, mở ra là xong?", answer: "Chìa khoá" },
      { question: "🪑 Cái gì ngồi lên thì sướng, đứng dậy thì tiếc?", answer: "Ghế massage" },
      { question: "👕 Cái gì ôm sát thân thể, mỗi ngày thay một lần?", answer: "Áo" },
      { question: "🫣 Cái gì êm êm, ban đêm nằm lên, có mùi người quen?", answer: "Gối ngủ" },
      { question: "🚪 Cái gì đóng thì kín, mở thì ai cũng vào được?", answer: "Cánh cửa" }
  ];

  const pick = quiz[Math.floor(Math.random() * quiz.length)];

  return api.sendMessage(`CÂU ĐỐ VUI VẺ:\n${pick.question}\n💬 Trả lời nếu bạn nghĩ mình trong sáng 😏`, event.threadID, event.messageID);
};
