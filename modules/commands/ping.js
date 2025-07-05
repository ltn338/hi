module.exports.config = {
  name: "ping",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "ChatGPT",
  description: "Tag tất cả thành viên trong nhóm",
  commandCategory: "group",
  usages: "[nội dung tùy chọn]",
  cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
  const threadID = event.threadID;

  // Lấy toàn bộ thông tin thành viên nhóm
  const threadInfo = await api.getThreadInfo(threadID);
  const members = threadInfo.participantIDs;

  // Xoá ID bot khỏi danh sách tag
  const botID = api.getCurrentUserID();
  const mentions = [];

  for (let id of members) {
    if (id != botID) {
      mentions.push({
        tag: "@" + id,
        id: id
      });
    }
  }

  // Tin nhắn kèm tag
  const content = args.join(" ") || "📣 Ping toàn bộ thành viên!";
  const mentionTags = mentions.map(u => ({
    id: u.id,
    tag: "@" + u.id
  }));

  return api.sendMessage({
    body: content,
    mentions: mentionTags
  }, threadID);
};
