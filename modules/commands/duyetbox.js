module.exports.config = {
  name: "duyetbox",
  version: "1.0.2",
  hasPermssion: 1,
  credits: "Thiệu Trung Kiên (sửa bởi ChatGPT)",
  description: "Duyệt Thành Viên Trong Danh Sách Phê Duyệt Box",
  commandCategory: "Quản Trị Viên",
  usages: "duyetbox",
  cooldowns: 0
};

module.exports.run = async function({ args, event, api, Users }) {
  const threadInfo = await api.getThreadInfo(event.threadID);
  let { approvalQueue, adminIDs } = threadInfo;

  // Kiểm tra quyền admin
  const botIsAdmin = adminIDs.some(admin => admin.id === api.getCurrentUserID());
  if (!botIsAdmin) {
    return api.sendMessage("⚠️ Bot cần quyền quản trị viên để duyệt thành viên. Vui lòng cấp quyền và thử lại.", event.threadID);
  }

  if (approvalQueue.length === 0) {
    return api.sendMessage("✅ Hiện không có ai trong danh sách chờ duyệt.", event.threadID);
  }

  let list = "";
  for (let i = 0; i < approvalQueue.length; i++) {
    const id = approvalQueue[i].requesterID;
    let name = await Users.getNameUser(id);
    if (!name || name.toLowerCase().includes("người dùng facebook")) {
      try {
        const userInfo = await api.getUserInfo(id);
        name = userInfo[id]?.name || `UID: ${id}`;
      } catch {
        name = `UID: ${id}`;
      }
    }

    list += `[${i + 1}] ${name} - ${id}\n`;
  }

  list += `\n👉 Reply tin nhắn này theo **số thứ tự** thành viên bạn muốn duyệt.`;

  return api.sendMessage(`🦋====『 DANH SÁCH CHỜ DUYỆT 』====🦋\n\n${list}`, event.threadID, (err, info) => {
    if (!err) {
      global.client.handleReply.push({
        name: module.exports.config.name,
        author: event.senderID,
        messageID: info.messageID,
        type: "reply"
      });
    }
  });
};

module.exports.handleReply = async function({ api, event, handleReply }) {
  const { threadID, messageID, body } = event;
  if (handleReply.type !== "reply") return;

  const index = parseInt(body) - 1;
  const approvalQueue = (await api.getThreadInfo(threadID)).approvalQueue;

  if (isNaN(index) || index < 0 || index >= approvalQueue.length) {
    return api.sendMessage("❌ Số bạn chọn không hợp lệ. Vui lòng thử lại.", threadID);
  }

  const requesterID = approvalQueue[index].requesterID;
  try {
    await api.addUserToGroup(requesterID, threadID);
    await api.sendMessage(`✅ Đã duyệt thành viên vào nhóm thành công.`, threadID);
    return api.unsendMessage(handleReply.messageID);
  } catch (error) {
    return api.sendMessage(`❌ Không thể thêm thành viên vào nhóm. Có thể người này đã rời nhóm hoặc bot không có quyền.`, threadID);
  }
};
