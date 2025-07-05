const fs = require("fs");

module.exports.config = {
  name: "kbb",
  version: "1.2.0",
  hasPermssion: 0,
  credits: "LeThanh + GPT",
  description: "Chơi kéo búa bao có cược, không ảnh, không lỗi",
  commandCategory: "Game",
  usages: "[kéo|búa|bao] [số tiền]",
  cooldowns: 3
};

const choices = ["kéo", "búa", "bao"];
const emojis = {
  kéo: "✌️",
  búa: "✊",
  bao: "✋"
};

const dataPath = __dirname + "/cache/kbb_data.json";
if (!fs.existsSync(dataPath)) fs.writeFileSync(dataPath, "{}");

function getResult(player, bot) {
  if (player === bot) return "hoà";
  if (
    (player === "kéo" && bot === "bao") ||
    (player === "búa" && bot === "kéo") ||
    (player === "bao" && bot === "búa")
  ) return "thắng";
  return "thua";
}

module.exports.run = async function ({ api, event, args, Users }) {
  const { threadID, senderID, messageID } = event;

  const kbbData = JSON.parse(fs.readFileSync(dataPath));
  if (!kbbData[senderID]) kbbData[senderID] = { money: 50000, winStreak: 0 };

  let userMoney = kbbData[senderID].money;
  let winStreak = kbbData[senderID].winStreak;

  const playerChoice = args[0]?.toLowerCase();
  const bet = parseInt(args[1]);

  if (!choices.includes(playerChoice))
    return api.sendMessage("⚠️ Vui lòng chọn: kéo, búa hoặc bao.", threadID, messageID);

  if (isNaN(bet) || bet <= 0)
    return api.sendMessage("⚠️ Nhập số tiền hợp lệ để cược.", threadID, messageID);

  if (bet > userMoney)
    return api.sendMessage("⚠️ Bạn không đủ tiền để cược.", threadID, messageID);

  const botChoice = choices[Math.floor(Math.random() * choices.length)];
  const result = getResult(playerChoice, botChoice);

  let moneyChange = 0;
  let resultText = "";
  const name = await Users.getNameUser(senderID);

  if (result === "hoà") {
    resultText = "🤝 HOÀ (x0)";
    winStreak = 0;
  } else if (result === "thắng") {
    moneyChange = bet;
    userMoney += bet;
    winStreak += 1;
    resultText = "🎉 THẮNG (x2)";
  } else {
    moneyChange = -bet;
    userMoney -= bet;
    winStreak = 0;
    resultText = "💀 THUA (x0)";
  }

  kbbData[senderID].money = userMoney;
  kbbData[senderID].winStreak = winStreak;
  fs.writeFileSync(dataPath, JSON.stringify(kbbData, null, 2));

  const msg =
`👤 Người chơi: ${name}
⚔️ Chế độ: Thường ⭐
🔥 Chuỗi thắng: ${winStreak} trận

🎯 KẾT QUẢ: ${resultText}
✂️ Bạn chọn: ${playerChoice.toUpperCase()} ${emojis[playerChoice]}
🤖 Bot chọn: ${botChoice.toUpperCase()} ${emojis[botChoice]}

💰 Tiền cược: ${bet.toLocaleString()} VNĐ
💸 ${moneyChange >= 0 ? "Thắng được" : "Mất"}: ${Math.abs(moneyChange).toLocaleString()} VNĐ
💵 Số dư hiện tại: ${userMoney.toLocaleString()} VNĐ`;

  return api.sendMessage(msg, threadID, messageID);
};
