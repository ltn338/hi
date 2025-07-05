const fs = require('fs-extra');
const axios = global.nodemodule["axios"];
const path = require("path");
const dataPath = path.resolve(__dirname, 'data', 'setlove.json');
const imagesPath = path.resolve(__dirname, 'data', 'setlove');

module.exports.config = {
    name: "setlove",
    version: "1.2.0",
    hasPermssion: 0,
    credits: "",
    description: "Set love",
    commandCategory: "Tình Yêu",
    usages: "setlove set/check/del/album/edit/display",
    cooldowns: 5,
    dependencies: {
        "fs-extra": "",
        "axios": ""
    }
};

module.exports.onLoad = async () => {
    if (!await fs.pathExists(dataPath)) {
        await fs.ensureFile(dataPath);
        await fs.writeFile(dataPath, JSON.stringify([]));
    }
    if (!await fs.pathExists(imagesPath)) {
        await fs.mkdir(imagesPath);
    }
};

const fancy = str => str
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .split('').map(c =>
      c.match(/[a-zA-Z]/) ?
        String.fromCharCode(0x1D4D0 + c.toLowerCase().charCodeAt(0) - 97) : c
    ).join('');

module.exports.run = async function ({ event, api, args }) {
    const { threadID, messageID, senderID, mentions } = event;
    const now = Date.now();
    const userImagesPath = path.resolve(imagesPath, senderID.toString());
    if (!await fs.pathExists(userImagesPath)) await fs.mkdir(userImagesPath);

    let loveData = [];
    try { loveData = JSON.parse(await fs.readFile(dataPath)); } catch { loveData = []; }

    const cmd = args[0];

    if (cmd === "set") {
        if (Object.keys(mentions).length === 0)
            return api.sendMessage("❎ Vui lòng tag một người để set love.", threadID, messageID);

        const taggedID = Object.keys(mentions)[0];
        const taggedName = mentions[taggedID];
        const exists = loveData.find(r =>
            [r.person1, r.person2].includes(senderID) ||
            [r.person1, r.person2].includes(taggedID)
        );
        if (exists) {
            const other = exists.person1 === senderID ? exists.person2 : exists.person1;
            const otherName = (await api.getUserInfo(other))[other].name;
            const msg = exists.person1 === senderID || exists.person2 === senderID
                ? "❎ Bạn không thể ngoại tình với người khác."
                : `❎ Bạn không thể cướp người yêu của ${otherName}.`;
            return api.sendMessage(msg, threadID, messageID);
        }

        const body =
`💌🌸━━━━━━━━━━━━🌸💌
💖 𝐘Ê𝐔 𝐂Ầ𝐔 𝐒𝐄𝐓 𝐋𝐎𝐕𝐄 💖

📩 Gửi đến: ${taggedName}  
👤 Từ: ${senderID}

Bạn có muốn trở thành cặp đôi với người được tag không?

👉 **Cả hai người thả cảm xúc 👍 (like) vào tin nhắn này để xác nhận tình yêu nhé!**
🌸━━━━━━━━━━━━🌸`;

        api.sendMessage({ body, mentions: [{ tag: taggedName, id: taggedID }] }, threadID, (e, info) => {
            global.client.handleReaction.push({
                name: this.config.name,
                messageID: info.messageID,
                author: senderID,
                taggedUserID: taggedID,
                taggedUserName: taggedName,
                hasSenderReacted: false,
                hasTaggedUserReacted: false,
                type: "awaitReaction"
            });
        }, messageID);

    } else if (cmd === "check") {
        const rel = loveData.find(r => [r.person1, r.person2].includes(senderID));
        if (!rel) return api.sendMessage("❎ Bạn hiện chưa có người yêu.", threadID, messageID);

        const partnerID = rel.person1 === senderID ? rel.person2 : rel.person1;
        const partnerName = (await api.getUserInfo(partnerID))[partnerID].name;
        const diff = Math.floor((now - new Date(rel.date).getTime()) / 60000);
        const months = Math.floor(diff / (60*24*30));
        const days = Math.floor((diff % (60*24*30)) / (60*24));
        const hours = Math.floor((diff % (60*24)) / 60);
        const mins = diff % 60;

        const attachments = [];
        const images = await fs.readdir(userImagesPath);
        (rel.selectedImages || []).forEach(img => {
            if (images.includes(img))
                attachments.push(fs.createReadStream(path.resolve(userImagesPath, img)));
        });

        const body =
`🎉🌹━━━━━━━━━━━━🌹🎉
${fancy("KY NIEM TINH YEU")}

😍 𝓑ạ𝓷 + ${partnerName}
⏳ 𝓣𝓲𝓶𝓮 𝓉𝓇ὰ𝓂:
• ${months} tháng  
• ${days} ngày  
• ${hours} giờ ${mins} phút

💌 𝓜ã𝓲 𝓫ệ𝓷 𝓷𝓱𝓪𝓊 🌸
━━━━━━━━━━━━`;

        api.sendMessage({ body, attachment: attachments }, threadID, messageID);

    } else if (cmd === "del") {
        const rel = loveData.find(r => [r.person1, r.person2].includes(senderID));
        if (!rel) return api.sendMessage("❎ Bạn chưa có người yêu để hủy.", threadID, messageID);

        const partnerID = rel.person1 === senderID ? rel.person2 : rel.person1;
        const partnerName = (await api.getUserInfo(partnerID))[partnerID].name;

        const body =
`💔━━━━━━━━━━━━💔
❗️ 𝐘Ê𝐔 𝐂Ầ𝐔 𝐇Ũ𝐘 𝐋𝐎𝐕𝐄 ❗️

👤 Người gửi: ${senderID}  
👤 Đến: ${partnerName}

👉 Thả like 👍 để đồng ý hủy tình yêu nhé!
━━━━━━━━━━━━`;

        api.sendMessage({ body, mentions: [{ tag: partnerName, id: partnerID }] }, threadID, (e, info) => {
            global.client.handleReaction.push({
                name: this.config.name,
                messageID: info.messageID,
                author: senderID,
                partnerID,
                partnerName,
                type: "cancel"
            });
        }, messageID);

        setTimeout(async () => {
            let d = [];
            try { d = JSON.parse(await fs.readFile(dataPath)); } catch {}
            d = d.filter(r =>
                !( [r.person1, r.person2].includes(senderID) &&
                   [r.person1, r.person2].includes(partnerID) )
            );
            await fs.writeFile(dataPath, JSON.stringify(d));
            [senderID, partnerID].forEach(async u => {
                const p = path.resolve(imagesPath, u.toString());
                if (await fs.pathExists(p)) await fs.remove(p);
            });
            api.sendMessage("🗑️ Đã xóa album và dữ liệu set love của hai bạn.", threadID);
        }, 60*1000);

    } else if (cmd === "album") {
        if (!await fs.pathExists(userImagesPath)) return api.sendMessage("❎ Album trống.", threadID, messageID);
        const imgs = await fs.readdir(userImagesPath);
        const attach = imgs.map(f => fs.createReadStream(path.resolve(userImagesPath, f)));
        api.sendMessage({ body: "🖼️ Album ảnh của bạn:", attachment: attach }, threadID, messageID);

    } else if (cmd === "display") {
        const rel = loveData.find(r => [r.person1, r.person2].includes(senderID));
        if (!rel) return api.sendMessage("❎ Bạn chưa có người yêu.", threadID, messageID);
        const imgs = await fs.readdir(userImagesPath);
        if (imgs.length === 0) return api.sendMessage("❎ Album trống.", threadID, messageID);

        const selected = rel.selectedImages || [];
        const list = imgs.map((img, i) => `${i+1}. ${img} ${selected.includes(img) ? '✅' : '❌'}`).join("\n");
        const body =
`🖼️━━━━━━━━━━━━🖼️
📸 ALBUM KỶ NIỆM 📸

${list}
━━━━━━━━━━━━
➡️ Reply số ảnh muốn hiển thị`;

        const attach = imgs.map(f => fs.createReadStream(path.resolve(userImagesPath, f)));
        api.sendMessage({ body, attachment: attach }, threadID, messageID);

    } else if (cmd === "edit") {
        const rel = loveData.find(r => [r.person1, r.person2].includes(senderID));
        if (!rel) return api.sendMessage("❎ Bạn chưa có người yêu để sửa album.", threadID, messageID);

        const body =
`✏️━━━━━━━━━━━━✏️
📋 CHỈNH SỬA ALBUM

1️⃣ Thêm ảnh  
2️⃣ Xóa ảnh  
3️⃣ Thay thế ảnh  

➡️ Reply với số tương ứng`;
        api.sendMessage({ body }, threadID, (e, info) => {
            global.client.handleReply.push({
                name: this.config.name,
                messageID: info.messageID,
                author: senderID,
                type: "editAlbum"
            });
        }, messageID);

    } else {
        const help =
`🌸━━━━━━━━━━━━🌸
📘 𝐇ƯỚ𝐍𝐆 𝐃Ẫ𝐍 𝐒𝐄𝐓 𝐋𝐎𝐕𝐄

• setlove set @tag  
• setlove check  
• setlove del  
• setlove album  
• setlove edit  
• setlove display  
━━━━━━━━━━━━`;
        api.sendMessage(help, threadID, messageID);
    }
};

module.exports.handleReaction = async ({ api, event, handleReaction }) => {
    const { threadID, messageID, userID, reaction } = event;
    if (reaction !== '👍') return;

    if (handleReaction.type === "awaitReaction") {
        if (userID === handleReaction.author) handleReaction.hasSenderReacted = true;
        if (userID === handleReaction.taggedUserID) handleReaction.hasTaggedUserReacted = true;

        if (handleReaction.hasSenderReacted && handleReaction.hasTaggedUserReacted) {
            let d = [];
            try { d = JSON.parse(await fs.readFile(dataPath)); } catch {}
            d.push({
                person1: handleReaction.author,
                person2: handleReaction.taggedUserID,
                date: new Date().toISOString()
            });
            await fs.writeFile(dataPath, JSON.stringify(d));

            api.sendMessage({
                body:
`🎊━━━━━━━━━━━━🎊
💞 CHÚC MỪNG 💞

${handleReaction.taggedUserName} và bạn đã chính thức nên một cặp đôi 🎉
━━━━━━━━━━━━`,
                mentions: [{ tag: handleReaction.taggedUserName, id: handleReaction.taggedUserID }]
            }, threadID, messageID);
        }
    } else if (handleReaction.type === "cancel") {
        const { author, partnerID } = handleReaction;
        if (![author, partnerID].includes(userID)) return;

        let d = [];
        try { d = JSON.parse(await fs.readFile(dataPath)); } catch {}
        d = d.filter(r =>
            !( (r.person1 === author && r.person2 === partnerID) ||
               (r.person1 === partnerID && r.person2 === author) )
        );
        await fs.writeFile(dataPath, JSON.stringify(d));
        api.sendMessage("✅ Đã hủy set love thành công.", threadID, messageID);
    }
};

module.exports.handleReply = async function ({ api, event, handleReply }) {
    const { threadID, messageID, senderID, body, attachments } = event;
    const userImagesPath = path.resolve(imagesPath, senderID.toString());
    if (!await fs.pathExists(userImagesPath)) await fs.mkdir(userImagesPath);
    const images = await fs.readdir(userImagesPath);

    const save = async url => {
        const name = `img_${Date.now()}.png`;
        const filepath = path.resolve(userImagesPath, name);
        const res = await axios.get(url, { responseType: 'stream' });
        await new Promise((resv, rej) => {
            const w = fs.createWriteStream(filepath);
            res.data.pipe(w);
            w.on('finish', resv);
            w.on('error', rej);
        });
        return name;
    };

    switch (handleReply.type) {
        case "editAlbum":
            if (body === "1") {
                api.sendMessage("📷 Gửi ảnh để thêm vào album nhé!", threadID, (e, info) => {
                    global.client.handleReply.push({ ...handleReply, type: "addImage" });
                }, messageID);
            } else if (body === "2") {
                if (images.length === 0) return api.sendMessage("❎ Album trống.", threadID, messageID);
                const list = images.map((f,i)=>`${i+1}. ${f}`).join("\n");
                api.sendMessage(`🗑️ Chọn ảnh để xóa:\n${list}`, threadID, (e, info) => {
                    global.client.handleReply.push({ name: this.config.name, messageID: info.messageID, author: senderID, type: "removeImage", images });
                }, messageID);
            } else if (body === "3") {
                if (images.length === 0) return api.sendMessage("❎ Album trống.", threadID, messageID);
                const list = images.map((f,i)=>`${i+1}. ${f}`).join("\n");
                api.sendMessage(`🔄 Chọn ảnh để thay thế:\n${list}`, threadID, (e, info) => {
                    global.client.handleReply.push({ name: this.config.name, messageID: info.messageID, author: senderID, type: "replaceImage", images });
                }, messageID);
            } else api.sendMessage("❌ Lựa chọn không hợp lệ (1–3).", threadID, messageID);
            break;

        case "addImage":
            if (!attachments[0] || attachments[0].type !== 'photo')
                return api.sendMessage("❎ Vui lòng gửi ảnh.", threadID, messageID);
            try {
                await save(attachments[0].url);
                api.sendMessage("✅ Đã thêm ảnh vào album!", threadID, messageID);
            } catch {
                api.sendMessage("❎ Lỗi khi thêm ảnh.", threadID, messageID);
            }
            break;

        case "removeImage":
            const iRem = parseInt(body)-1;
            if (iRem < 0 || iRem >= handleReply.images.length)
                return api.sendMessage("❌ Số không hợp lệ.", threadID, messageID);
            await fs.unlink(path.resolve(userImagesPath, handleReply.images[iRem]));
            api.sendMessage("✅ Đã xóa ảnh!", threadID, messageID);
            break;

        case "replaceImage":
            const iRep = parseInt(body)-1;
            if (iRep < 0 || iRep >= handleReply.images.length)
                return api.sendMessage("❌ Số không hợp lệ.", threadID, messageID);
            api.sendMessage("📤 Gửi ảnh mới để thay thế nhé.", threadID, (e, info) => {
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: senderID,
                    type: "replaceWithNew",
                    imageToReplace: handleReply.images[iRep]
                });
            }, messageID);
            break;

        case "replaceWithNew":
            if (!attachments[0] || attachments[0].type !== 'photo')
                return api.sendMessage("❎ Vui lòng gửi ảnh.", threadID, messageID);
            try {
                const newName = await save(attachments[0].url);
                await fs.unlink(path.resolve(userImagesPath, handleReply.imageToReplace));
                api.sendMessage("✅ Đã thay ảnh mới!", threadID, messageID);
            } catch {
                api.sendMessage("❎ Lỗi khi thay ảnh.", threadID, messageID);
            }
            break;
    }
};
