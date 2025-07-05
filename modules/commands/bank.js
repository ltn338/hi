module.exports.config = {
  name: "bank",
  version: "2.2.0",
  hasPermssion: 0,
  credits: "Le Thanh + GPT",
  description: "Ngân hàng cá nhân + vay tiền + trả góp",
  commandCategory: "Tài chính",
  usages: "/bank | bank gửi <số> | rút <số> | vay <số> <giờ> <phút> | list | trả <số/all>",
  cooldowns: 5
};

const fs = require("fs");
const path = __dirname + "/../bankData.json";
const loanPath = __dirname + "/../loanData.json";

module.exports.run = async ({ api, event, args, Currencies }) => {
  const { threadID, senderID, messageID } = event;
  const now = Date.now();

  if (!fs.existsSync(path)) fs.writeFileSync(path, "{}");
  if (!fs.existsSync(loanPath)) fs.writeFileSync(loanPath, "{}");

  const data = JSON.parse(fs.readFileSync(path));
  const loanData = JSON.parse(fs.readFileSync(loanPath));

  if (!data[senderID]) {
    data[senderID] = {
      name: (await api.getUserInfo(senderID))[senderID].name,
      stk: Math.floor(Math.random() * 8999999999999 + 1000000000000),
      balance: 0,
      interestRate: (Math.random() * (10 - 6) + 6).toFixed(8) / 100,
      lastInterestTime: now,
      createdAt: now,
      status: "Đang hoạt động"
    };
  }

  const userBank = data[senderID];
  const writeData = () => fs.writeFileSync(path, JSON.stringify(data, null, 2));
  const writeLoan = () => fs.writeFileSync(loanPath, JSON.stringify(loanData, null, 2));

  const hour = 60 * 60 * 1000;
  if (now - userBank.lastInterestTime >= hour && userBank.balance > 0) {
    const interest = Math.floor(userBank.balance * userBank.interestRate);
    userBank.balance += interest;
    userBank.lastInterestTime = now;
  }

  // Gửi tiền
  if (["gửi", "nap", "nạp"].includes(args[0])) {
    let amount;
    const userMoney = (await Currencies.getData(senderID)).money;
    if (args[1] === "all") {
      amount = userMoney;
    } else {
      amount = parseInt(args[1]);
      if (isNaN(amount) || amount <= 0) return api.sendMessage("❌ Số tiền không hợp lệ.", threadID, messageID);
      if (amount > userMoney) return api.sendMessage("❌ Bạn không đủ tiền để gửi!", threadID, messageID);
    }

    userBank.balance += amount;
    await Currencies.decreaseMoney(senderID, amount);
    writeData();

    return api.sendMessage(`✅ Gửi thành công ${amount.toLocaleString()}đ vào ngân hàng.\n💰 Số dư: ${userBank.balance.toLocaleString()}đ`, threadID, messageID);
  }

  // Rút tiền
  if (["rút", "rut"].includes(args[0])) {
    let amount;
    if (args[1] === "all") {
      amount = userBank.balance;
    } else {
      amount = parseInt(args[1]);
      if (isNaN(amount) || amount <= 0) return api.sendMessage("❌ Số tiền không hợp lệ.", threadID, messageID);
      if (amount > userBank.balance) return api.sendMessage("❌ Bạn không có đủ tiền trong ngân hàng!", threadID, messageID);
    }

    userBank.balance -= amount;
    await Currencies.increaseMoney(senderID, amount);
    writeData();

    return api.sendMessage(`✅ Đã rút ${amount.toLocaleString()}đ từ ngân hàng!\n💰 Còn lại: ${userBank.balance.toLocaleString()}đ`, threadID, messageID);
  }

  // Vay tiền
  if (args[0] === "vay") {
    const amount = parseInt(args[1]);
    const hours = parseInt(args[2]) || 0;
    const minutes = parseInt(args[3]) || 0;

    if (!amount || amount <= 0 || isNaN(amount)) return api.sendMessage("❌ Nhập số tiền vay hợp lệ!", threadID, messageID);

    const duration = hours * 60 * 60 * 1000 + minutes * 60 * 1000;
    const totalRepay = Math.floor(amount * 3.4);

    loanData[senderID] = {
      userID: senderID,
      name: userBank.name,
      borrowed: amount,
      createdAt: now,
      duration,
      repay: totalRepay
    };

    await Currencies.increaseMoney(senderID, amount);
    writeLoan();

    return api.sendMessage(
      `💰 Bạn đã vay ${amount.toLocaleString()}đ\n⏳ Thời hạn: ${hours}h ${minutes}p\n📌 Tổng trả: ${totalRepay.toLocaleString()}đ\n⚠️ Hãy trả đúng hạn để tránh bị phạt!`,
      threadID, messageID
    );
  }

  // Trả nợ
  if (["trả", "tra", "trả"].includes(args[0])) {
    const userLoan = loanData[senderID];
    if (!userLoan) return api.sendMessage("❌ Bạn không có khoản vay nào đang tồn tại!", threadID, messageID);

    let payAmount;
    const userMoney = (await Currencies.getData(senderID)).money;

    if (args[1] === "all") {
      payAmount = userLoan.repay;
    } else {
      payAmount = parseInt(args[1]);
      if (isNaN(payAmount) || payAmount <= 0) return api.sendMessage("❌ Số tiền trả không hợp lệ!", threadID, messageID);
      if (payAmount > userLoan.repay) payAmount = userLoan.repay;
    }

    if (payAmount > userMoney) return api.sendMessage("❌ Bạn không có đủ tiền để trả!", threadID, messageID);

    await Currencies.decreaseMoney(senderID, payAmount);
    userLoan.repay -= payAmount;

    let msg = `💸 Đã trả ${payAmount.toLocaleString()}đ cho khoản vay.\n`;

    if (userLoan.repay <= 0) {
      delete loanData[senderID];
      msg += `🎉 Bạn đã thanh toán hết khoản vay!`;
    } else {
      msg += `📌 Số tiền còn lại cần trả: ${userLoan.repay.toLocaleString()}đ.`;
    }

    writeLoan();
    return api.sendMessage(msg, threadID, messageID);
  }

  // Danh sách nợ
  if (args[0] === "list") {
    const users = Object.values(loanData);
    if (users.length === 0) return api.sendMessage("✅ Hiện không có ai vay tiền!", threadID, messageID);

    let totalLoan = 0;
    const msg = users.map(u => {
      const remainingMs = u.createdAt + u.duration - now;
      totalLoan += u.borrowed;

      let timeLeft = "Đã quá hạn";
      if (remainingMs > 0) {
        const h = Math.floor(remainingMs / (60 * 60 * 1000));
        const m = Math.floor((remainingMs % (60 * 60 * 1000)) / (60 * 1000));
        timeLeft = `${h}h ${m}p`;
      }

      return (
        `👤 UserID: ${u.userID}\n` +
        `💰 Số tiền: ${u.borrowed.toLocaleString()}đ\n` +
        `⏳ Thời hạn: ${timeLeft}\n` +
        `📌 Tổng trả: ${u.repay.toLocaleString()}đ\n────────────`
      );
    }).join("\n");

    return api.sendMessage(
      `🔔 THÔNG BÁO NỢ VAY ${new Date().toLocaleTimeString("vi-VN")} HÀNG NGÀY 🔔\n` +
      `______________________________\n` +
      `${msg}\n📊 Tổng số tiền đã vay: ${totalLoan.toLocaleString()}đ\n⚠️ Hãy trả nợ đúng hạn để tránh bị phạt!`,
      threadID,
      messageID
    );
  }

  // Hiển thị thông tin ngân hàng
  if (args.length === 0) {
    const remaining = hour - (now - userBank.lastInterestTime);
    const h = Math.floor(remaining / 3600000);
    const m = Math.floor((remaining % 3600000) / 60000);

    return api.sendMessage(
      `🏦 [ MIRAI BANK ]\n👤 Chủ tài khoản: ${userBank.name}\n🪪 STK: ${userBank.stk}\n💰 Số dư: ${userBank.balance.toLocaleString()}đ\n📈 Lãi suất: ${(userBank.interestRate * 100).toFixed(2)}%\n🕓 Còn ${h}h ${m}p để tính lãi\n📅 Tạo lúc: ${new Date(userBank.createdAt).toLocaleString("vi-VN")}`,
      threadID, messageID
    );
  }

  return api.sendMessage("❌ Sai cú pháp!\n💡 Dùng: bank gửi <số> | rút <số> | vay <số> <giờ> <phút> | trả <số/all> | list", threadID, messageID);
};
