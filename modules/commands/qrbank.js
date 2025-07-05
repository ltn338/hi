const fs = require("fs");

module.exports.config = {
  name: "qrbank",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "LeThanh + GPT",
  description: "Tạo mã QR ngân hàng Mirai",
  commandCategory: "Ngân hàng",
  usages: "",
  cooldowns: 5
};

const bankDataPath = __dirname + "/cache/bank.json";
if (!fs.existsSync(bankDataPath)) fs.writeFileSync(bankDataPath, "{}");

function generateAccountID() {
  return Math.floor(100000000000000 + Math.random() * 900000000000000).toString();
}

function generateQRCode(length = 12) {
  const charset = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let qr = "";
  for (let i = 0; i < length; i++) {
    qr += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return qr;
}

module.exports.run = async ({ api, event, Users }) => {
  const { threadID, senderID, messageID } = event;
  const bank = JSON.parse(fs.readFileSync(bankDataPath));

  // Tạo tài khoản nếu chưa có
  if (!bank[senderID]) {
    const name = await Users.getNameUser(senderID);
    bank[senderID] = {
      name,
      stk: generateAccountID(),
      money: 0
    };
  }

  const userBank = bank[senderID];
  const qrCode = generateQRCode();

  fs.writeFileSync(bankDataPath, JSON.stringify(bank, null, 2));

  const msg =
`[ NGÂN HÀNG MIRAI QR BANK ]
👤 Chủ tài khoản: ${userBank.name}
🏦 STK: ${userBank.stk}
💰 Số dư: ${userBank.money.toLocaleString()}$
🧾 Mã QR chuyển khoản: ${qrCode}`;

  return api.sendMessage(msg, threadID, messageID);
};
