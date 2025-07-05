module.exports.config = {
  name: "setname",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "Le Thanh x ChatGPT",
  description: "Xem hoặc đổi biệt danh trong nhóm",
  commandCategory: "Nhóm",
  usages: "setname list | setname @tag/UID [biệt danh] | setname [biệt danh]",
  cooldowns: 3
};

module.exports.run = async function ({ api, event, args, Users }) {
  const { threadID, messageID, senderID, mentions } = event;

  // === 📋 LỆNH: setname list ===
  if (args[0] === "list") {
    try {
      const threadInfo = await api.getThreadInfo(threadID);
      const members = threadInfo.userInfo;
      const nicknameMap = threadInfo.nicknames || {};

      const hasNickname = [];
      const noNickname = [];

      for (const user of members) {
        if (user.type !== "User") continue;

        const uid = user.id;
        const name = user.name || "Không rõ";
        const nickname = nicknameMap[uid];

        if (nickname && nickname.trim().toLowerCase() !== name.trim().toLowerCase()) {
          hasNickname.push(`✅ ${name} (${uid}) ➜ "${nickname}"`);
        } else {
          noNickname.push(`❌ ${name} (${uid})`);
        }
      }

      const msg =
        `📋 Danh sách biệt danh nhóm:\n\n` +
        `=== ✅ ĐÃ CÓ BIỆT DANH ===\n` +
        `${hasNickname.length > 0 ? hasNickname.join("\n") : "Không ai cả"}\n\n` +
        `=== ❌ CHƯA CÓ BIỆT DANH ===\n` +
        `${noNickname.length > 0 ? noNickname.join("\n") : "Không ai cả"}`;

      return api.sendMessage(msg, threadID, messageID);
    } catch (err) {
      console.error("❌ Lỗi lấy thông tin nhóm:", err);
      return api.sendMessage("❌ Không thể lấy thông tin nhóm.", threadID, messageID);
    }
  }

  // === ✏️ LỆNH: setname (đổi biệt danh) ===
  let targetID, newNickname;

  // Trường hợp chỉ nhập 1 từ => tự đổi biệt danh
  if (args.length === 1) {
    targetID = senderID;
    newNickname = args[0];
  }
  // Trường hợp tag hoặc nhập UID + biệt danh
  else if (args.length >= 2) {
    if (Object.keys(mentions).length > 0) {
      targetID = Object.keys(mentions)[0];
      newNickname = args.slice(1).join(" ");
    } else {
      targetID = args[0];
      newNickname = args.slice(1).join(" ");
    }
  } else {
    return api.sendMessage(
      "📌 Cách dùng:\n• setname list — Xem ai đã/ chưa có biệt danh\n• setname [biệt danh mới] — Đổi biệt danh bản thân\n• setname @tag hoặc UID [biệt danh mới]",
      threadID,
      messageID
    );
  }

  try {
    await api.changeNickname(newNickname, threadID, targetID);
    const changer = await Users.getNameUser(senderID) || "Người dùng";
    const targetName = await Users.getNameUser(targetID) || "Người dùng";

    return api.sendMessage(`✅ ${changer} vừa đổi biệt danh của ${targetID === senderID ? "chính mình" : targetName} thành: "${newNickname}"`, threadID, messageID);
  } catch (err) {
    console.error("❌ Lỗi đổi biệt danh:", err);
    return api.sendMessage("❌ Không thể đổi biệt danh. Có thể do bot không đủ quyền hoặc UID/tag không hợp lệ.", threadID, messageID);
  }
};
