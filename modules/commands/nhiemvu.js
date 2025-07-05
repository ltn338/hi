module.exports.config = {
  name: "nhiemvu",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "Bạn hoặc GPT chỉnh sửa",
  description: "Nhiệm vụ mỗi ngày + reset mỗi 5 phút",
  commandCategory: "game",
  usages: "[số nhiệm vụ]",
  cooldowns: 5,
};

const fs = require("fs");
const path = __dirname + "/cache/nhiemvu.json";

const defaultTask = [
  { id: 1, desc: "Gửi 5 tin nhắn", reward: 1000, done: false, lastDone: 0 },
  { id: 2, desc: "Thắng 1 ván tài xỉu", reward: 3000, done: false, lastDone: 0 },
  { id: 3, desc: "Trả lời đúng 1 câu đố", reward: 2000, done: false, lastDone: 0 },
  { id: 4, desc: "Gõ lệnh /money", reward: 1500, done: false, lastDone: 0 }
];

function loadTasks(uid) {
  let data = {};
  if (fs.existsSync(path)) data = JSON.parse(fs.readFileSync(path));
  if (!data[uid]) data[uid] = JSON.parse(JSON.stringify(defaultTask));
  return data;
}

function saveTasks(uid, taskData) {
  let data = {};
  if (fs.existsSync(path)) data = JSON.parse(fs.readFileSync(path));
  data[uid] = taskData;
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

module.exports.run = async ({ api, event, args }) => {
  const { threadID, messageID, senderID } = event;
  const uid = senderID;
  const now = Date.now();
  const cooldown = 5 * 60 * 1000; // 5 phút

  const fullData = loadTasks(uid);
  let tasks = fullData[uid];

  // Reset nhiệm vụ nếu cooldown đã qua
  tasks.forEach(task => {
    if (task.done && now - task.lastDone >= cooldown) {
      task.done = false;
      task.lastDone = 0;
    }
  });

  // Nhận nhiệm vụ
  if (args[0]) {
    const taskNum = parseInt(args[0]);
    const task = tasks.find(t => t.id == taskNum);
    if (!task) return api.sendMessage("❌ Nhiệm vụ không tồn tại!", threadID, messageID);

    if (task.done && now - task.lastDone < cooldown) {
      const waitTime = Math.ceil((cooldown - (now - task.lastDone)) / 60000);
      return api.sendMessage(`⏳ Nhiệm vụ này đang cooldown. Vui lòng chờ ${waitTime} phút nữa để làm lại.`, threadID, messageID);
    }

    task.done = true;
    task.lastDone = now;
    saveTasks(uid, tasks);
    return api.sendMessage(`🎉 Bạn đã nhận ${task.reward}$ từ nhiệm vụ "${task.desc}"`, threadID, messageID);
  }

  // Hiển thị danh sách nhiệm vụ
  let msg = `🎯 𝗡𝗛𝗜𝗘̣̂𝗠 𝗩𝗨̣ 𝗛𝗢̂𝗠 𝗡𝗔𝗬\n\n`;
  msg += `📅 Ngày: ${new Date().toLocaleDateString('vi-VN')}\n🧑‍💻 ID: ${uid}\n`;
  msg += `📌 Danh sách nhiệm vụ:\n`;
  tasks.forEach(task => {
    const remaining = task.done && (now - task.lastDone < cooldown)
      ? ` (⏳ còn ${Math.ceil((cooldown - (now - task.lastDone)) / 60000)} phút)`
      : "";
    msg += `${task.done ? "✅" : "❌"} ${task.id}. ${task.desc} (${task.reward}$)${remaining}\n`;
  });
  msg += `\n📥 Dùng ,nv [số] để nhận thưởng\nVí dụ: ,nv 2`;

  saveTasks(uid, tasks);
  return api.sendMessage(msg, threadID, messageID);
};
