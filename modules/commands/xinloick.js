module.exports.config = {
  name: "xinloick",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Le Thanh - Cà Khịa Wife Edition",
  description: "Xin lỗi chồng kiểu hài hước, cà khịa thêm",
  commandCategory: "tình yêu",
  usages: "[tên chồng nếu có]",
  cooldowns: 3
};

module.exports.run = async function ({ api, event, args }) {
  const name = args.join(" ") || "chồng iu";

  const spicyApologies = [
    `🫣 Em xin lỗi chồng nha... vì em nói đúng quá nên chồng không cãi lại được 😌`,
    `🥲 Xin lỗi chồng vì đã làm chồng giận... mà sao chồng giận hoài không thấy đẹp trai lên gì hết trơn á 😅`,
    `😂 Em biết em sai rồi… sai khi không làm chồng giận sớm hơn để có cớ năn nỉ cho cute 🤭`,
    `🙃 Em xin lỗi chồng vì đã dùng tông giọng cao quá... lần sau em dùng... dao cho lẹ nha 😈`,
    `🐶 Chồng ơi, tha cho em đi... không thì tối nay em đem mền gối qua nhà mẹ ngủ đó, khỏi năn nỉ luôn 😜`,
    `😇 Em xin lỗi vì đã cằn nhằn nhiều… nhưng tại chồng lì quá nên em phải nhai lại cho chồng nhớ 🤪`,
    `💅 Chồng đừng giận nữa, nhìn mặt chồng lúc giận giống mèo bị ướt vậy đó, thương ghê á 😆`,
    `😌 Em sai rồi chồng à… sai vì đã không nhắc chồng đem rác đi đổ sớm hơn 5 phút thôi~`,
    `🤣 Xin lỗi chồng nha… lần sau nếu có giận, em sẽ làm to hơn để hàng xóm hóng cho đã 👏`,
    `😎 Em xin lỗi... nhưng không hối hận, vì nhờ em chồng mới biết thế nào là *kiếp làm chồng* 😂`
  ];

  const msg = spicyApologies[Math.floor(Math.random() * spicyApologies.length)];

  return api.sendMessage(msg, event.threadID, event.messageID);
};
