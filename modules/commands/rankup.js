const fs = require("fs-extra");
const path = __dirname + "/data/rankupData.json";

const levelTitles = {
  1: ["👶 Bé Mới Chập Chững", "🐣 Gà Con Dễ Thương", "🧻 Xé Nháp Tập Sự"],
  5: ["😈 Học Sinh Cá Biệt", "🎀 Công Chúa Hồng Hường", "🪞 Thích Soi Gương"],
  10: ["🕶 Dân Chơi Hệ Mặt Trời", "🍭 Bé Ngọt Ngào", "🐸 Ếch Cốm Đáng Ghét"],
  15: ["💥 Bạo Chúa Meme", "👑 Gái Xinh Ảo", "🧃 Chúa Tể Nước Ép"],
  20: ["🌙 Ma Cà Rồng Đêm", "🌞 Sứ Giả Ánh Sáng", "🐍 Rắn Cạp Nát Tất Cả"],
  30: ["💘 Tình Nhân Vạn Người Mê", "🔮 Ảo Thuật Sư Cảm Xúc", "🧟 Quái Nhân Biến Dị"],
  50: ["🔥 Trùm Cuối", "🍼 Bé Hư Đáng Yêu", "📀 Idol TikTok Dở Hơi"],
  75: ["🔪 Thánh Cà Khịa", "🥹 Em Bé Cảm Xúc", "🧬 Dị Nhân Trẻ Mồ Côi"],
  100: ["🌟 Huyền Thoại Sống", "🥇 Chúa Tể Vũ Trụ", "👑 Người Dẫn Dắt Lịch Sử"]
};

function calculateLevel(exp) {
  return Math.floor(Math.pow(exp / 50, 0.6));
}

function getExpForLevel(level) {
  return Math.ceil(Math.pow(level, 1 / 0.6) * 50);
}

function isDayTime() {
  const hour = new Date().getHours();
  return hour >= 6 && hour < 18;
}

function getTimeTitle(titles, isDay) {
  return titles.filter(title =>
    isDay
      ? !title.includes("🌙") && !title.includes("🧟") && !title.includes("👻") && !title.includes("🪬")
      : !title.includes("🌞") && !title.includes("👼") && !title.includes("🌄")
  );
}

function getTitleByLevel(level, isDay) {
  let currentTier = 1;
  for (const lvl in levelTitles) {
    if (level >= lvl) currentTier = lvl;
  }
  const candidates = getTimeTitle(levelTitles[currentTier], isDay);
  return candidates.length > 0
    ? candidates[Math.floor(Math.random() * candidates.length)]
    : levelTitles[currentTier][0];
}

function readRankupData() {
  if (!fs.existsSync(path)) fs.writeJsonSync(path, {});
  return fs.readJsonSync(path);
}

function writeRankupData(data) {
  fs.writeJsonSync(path, data, { spaces: 2 });
}

module.exports.config = {
  name: "rankup",
  version: "4.0-hardcore",
  hasPermssion: 0,
  credits: "Gaudev",
  description: "lồn",
  commandCategory: "Tiện ích",
  cooldowns: 1
};

module.exports.handleEvent = async function ({ api, event, Currencies, Users }) {
  const { senderID, threadID } = event;
  const rankData = readRankupData();
  const userCurrency = await Currencies.getData(senderID);
  let exp = userCurrency.exp || 0;
  let money = userCurrency.money || 0;

  const oldLevel = calculateLevel(exp);
  exp += 1; 
  const newLevel = calculateLevel(exp);
  const requiredExp = getExpForLevel(oldLevel + 1);

  if (newLevel > oldLevel && exp >= requiredExp) {
    const userName = (await Users.getData(senderID)).name;
    const isDay = isDayTime();
    const title = getTitleByLevel(newLevel, isDay);
    const bonus = 200;
    money += bonus;

    rankData[senderID] = {
      level: newLevel,
      exp,
      title
    };
    writeRankupData(rankData);

    await api.sendMessage(
      `✨ ${userName} đã lên cấp ${newLevel}!\n🏅 Nhận danh hiệu: ${title}\n💰 Thưởng: ${bonus}$`,
      threadID
    );
  }


  await Currencies.setData(senderID, { exp, money });
};

module.exports.run = async function ({ api, event, Currencies, Users }) {
  const { senderID, threadID, messageID } = event;
  const userCurrency = await Currencies.getData(senderID);
  const exp = userCurrency.exp || 0;
  const level = calculateLevel(exp);
  const isDay = isDayTime();
  const name = (await Users.getData(senderID)).name;

  const rankData = readRankupData();
  if (!rankData[senderID]) rankData[senderID] = {};
  rankData[senderID].level = level;
  rankData[senderID].exp = exp;
  if (!rankData[senderID].title) {
    rankData[senderID].title = getTitleByLevel(level, isDay);
  }
  writeRankupData(rankData);

  const title = rankData[senderID].title;
  const nextExpTotal = getExpForLevel(level + 1);
  const expNeeded = nextExpTotal - exp;

  return api.sendMessage(
    `📊 Thông tin của bạn:\n👤 Tên: ${name}\n📈 Level: ${level}\n⭐ EXP: ${exp}\n🎖 Danh hiệu: ${title}\n⏳ EXP cần để lên cấp ${level + 1}: ${expNeeded < 0 ? 0 : expNeeded}`,
    threadID,
    messageID
  );
};