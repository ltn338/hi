module.exports.config = {
  name: "menu",
  version: "2.3.0",
  hasPermission: 0,
  credits: "HÌNH ẢNH THÀNH VĂN BẢN",
  description: "Menu nhóm lệnh đẹp, phân trang, icon đúng",
  commandCategory: "Tiện ích",
  usages: "[menu/page/all]",
  cooldowns: 5
};

// Emoji độc nhất cho từng nhóm commandCategory
const UNIQUE_ICONS = [ "🪕", "🥓", "🎤", "🎧", "🌟", "💰", "🤸", "🖼️", "👥", "❤️", "🔍", "🎭", "⚙️", "⚔️", "🎲", "♻️", "📣", "🎥", "🖌️", "👤", "🪙", "📊", "📂", "📦", "📁", "🔮", "📈", "📉", "🧩" ];
const usedIcons = {};
let iconIndex = 0;
function assignUniqueIcon(category) {
  if (!usedIcons[category]) {
    usedIcons[category] = UNIQUE_ICONS[iconIndex++] || "📁";
  }
  return usedIcons[category];
}

function getGroups() {
  const gr = {}, disp = {};
  for (const [name, cmd] of global.client.commands) {
    const key = (cmd.config.commandCategory || "Khác").toLowerCase().trim();
    if (!gr[key]) gr[key] = [];
    gr[key].push(name);
    disp[key] = cmd.config.commandCategory;
  }
  return { gr, disp };
}

module.exports.run = async function ({ api, event, args }) {
  const { gr, disp } = getGroups();
  const keys = Object.keys(gr).sort();

  // ✨ MENU ALL tích hợp đầy đủ 314 lệnh + emoji
  if (args[0]?.toLowerCase() === "all") {
    const MODULE_EMOJI = {
      "2048":"🎯","4k":"🖼️","6mui":"🏋️‍♂️","accbot":"🤖","acp":"🧪","adc":"💊",
      "adduser":"👥","admin":"👑","adu":"🧸","afk":"😴","age":"🎂","album":"📸",
      "antiavtbox":"🚫","antibdad":"🚷","antiemoji":"🔤","antinamebox":"❌",
      "antiout":"🚪","antiqtv":"🛑","antispam":"🛡️","api":"🌐","audio":"🎧",
      "autobanuser":"🔨","autodow":"🚗","autodown":"🏎️","autoout":"🔚",
      "autopr":"🧰","autorep":"💬","autoseen":"👀","autosend":"📤",
      "autosetname":"✍️","autotrans":"🔁","avt":"📷","baicao":"🃏","banchanle":"🀄",
      "bank":"🏦","banking":"💳","baucua":"🦀","bigtext":"🔠","binary":"🔣",
      "boctham":"🕵️‍♂️","bopvu":"🧨","box":"🎱","boy":"👦","búcu":"😡","bye":"🖐️",
      "caidat":"⚙️","callad":"📞","camlenh":"💻","camtay":"🕹️","cautay":"⛸️",
      "canhbao":"🚨","capcutlink":"✂️","capcut":"✂️","cap":"🎓","capwall":"🧱",
      "capweb":"🌐","cardbox":"💼","cardinfo":"🧾","caro":"❎","catbox":"📦",
      "cauca":"🤔","caudo":"💬","cauhon":"🎯","cave":"🕳️","change":"♻️","check":"☑️",
      "checkmttq":"🔎","chiatay":"🖐️","chillcungtrung":"🧨","chuiadmin":"👮","chuibot":"🤬",
      "chuidenchet":"😡","chuilientuc":"😤","chupchung":"📸","chuyentien":"💵","clean":"🧽",
      "console":"🖥️","contact":"📇","convert":"🔄","copy":"🧻","cosplay":"🎭","crawl":"🕷️",
      "cuop":"🦹‍♂️","daily":"🗓️","danhgia":"✅","data":"📊","date":"🗓️","datlich":"📅",
      "delbox":"🗑️","delmsg":"❌","dhbc":"🚫","dizz":"📛","dodepgai":"💃","dodeptrai":"🕺",
      "dogay":"💅","domin":"🔥","donghiensex":"🧠","dovui":"🎲","draw":"✏️","duyetbox":"👑",
      "dum":"🍼","dịch":"🌍","đổi":"📊","emojimix":"🧩","event":"🎉","facebook":"📘",
      "fakebill":"🧾","farm":"🌱","fast":"⚡","fb":"🅱️","ff":"🎮","file":"🗂️","gadit":"🔑",
      "gaitt":"🕳️","gay":"🌈","ghichu":"📝","ghép":"❤️","giadinh":"👨‍👩‍👧‍👦","global":"🌐",
      "goibot":"🤖","gái":"👩","gỡ":"🧼","hack":"🧠","help":"💡","hetcuu":"🤕","hi":"🙋‍♂️",
      "hôn":"💋","idgenshin":"🎮","idsticker":"🆔","ig":"📸","imganime":"💮","imgur":"📤",
      "in4":"🆔","info":"📱","ip":"🌐","joinnoti":"📩","joker":"🃏","json":"🧾","jt":"🏷️",
      "kbb":"🧠","keobo":"📍","ketdung":"🗂️","kick":"⛔","kiemtien":"💸","kiss":"😘",
      "leavenoti":"🚪","lienquan":"⚔️","linkfb":"🔗","listban":"📃","listbb":"📂","listbox":"📋",
      "listqtv":"🧑‍⚖️","loli":"👶","love":"💖","lq":"📘","luật":"📜","lyrics":"🎼","mail10p":"⌰",
      "masoi":"🐺","mcstatus":"📡","meme":"😹","menu":"🎸","minecraft":"⛏️","money":"💵","moon":"🌕",
      "zmp4":"🎥","music":"🎶","mông":"🍑","namtay":"✋","nasa":"🚀","newbox":"💬","ngày":"📅","ngủ":"😴",
      "nhacnho":"🎶","nhantin":"📩","note":"📝","noti":"🔔","ntbonly":"🔕","offbot":"💢","onbot":"💡",
      "out":"🚪","outall":"📦","package":"🎁","pay":"💰","pending":"⌛","phantich":"🧠","phatnguoi":"🧍‍♂️",
      "ping":"🥔","pinterest":"📌","point":"🎯","ptavt":"🧍‍♀️","qrbank":"🏦","qtv":"🧑‍⚖️","qtvonly":"👮",
      "quiz":"❓","rankup":"📱","rdcc":"🎭","reallove":"🥰","rela":"🧵","rent":"🧾","reply":"📣","reqtv":"🧑‍⚖️",
      "resend":"🔁","resetmoney":"💸","rnamebot":"🐱‍🏍","rs":"🧍","run":"🏃","runmocky":"🧟‍♂️","say":"📢",
      "scl":"🔥","sdt":"📞","sendmsg":"📩","sendnoti":"📩","setdata":"📊","setdatabox":"📂","setinfo":"ℹ️",
      "setlove":"💘","setmoney":"💵","setname":"🧳","setnameall":"👥","setpoint":"🎯","setprefix":"🎛️",
      "shell":"🐚","ship":"🧳","shortcut":"🔍","siesta":"😴","sieunhan":"🦸","sing":"🎤","sinnhhat":"🎁",
      "skinlqmb":"🧴","slot":"🎰","spam":"📢","spam2":"🔊","spamban":"📣","spamcmt":"💬","spamngl":"📥",
      "spamsms":"📩","spamv2":"🗯️","spotify":"🎧","subnautica":"🧜‍♂️","sudoku":"🔢","tachnen":"🔥",
      "tag":"🏷️","tagadmin":"🧑‍⚖️","taglientuc":"🔣","tapngon":"🏑","taichinh":"📊","taixiu":"🎲",
      "tangqua":"🎁","taoanhbia":"🖼️","taoanhbox":"🎡","taobanner":"🎨","tarot":"🎴","thamgia":"🧩",
      "thathinh":"🫶","thayboi":"🏊","thinh":"📷","thoitiet":"☁️","thuthach":"🎯","tid":"🧑‍💼","tiente":"💰",
      "tikinfo":"📊","tiktok":"📱","timanh":"📸","time":"⏰","timejoin":"⌛","timnguoiyeu":"💕","tod":"🎯",
      "toilet":"🚽","top":"🥇","topp":"🏆","trans":"🌐","tt":"🧍‍♂️","ttt":"👥","tungdongxu":"💸",
      "tvmayman":"🍀","txglobal":"🌍","tát":"👋","uid":"🆔","upt":"📶","user":"🧑","video":"🎥","vuotlink":"🔗",
      "wanted":"🔎","weather":"🌤️","wiki":"🧠","work":"💼","xidach":"🃏","xinloick":"⛔","xinloivk":"🔞",
      "xnxx":"🔞","xoafile":"🗂️","xvideos":"🔞","yaytext":"✍️","ôm":"🤗","đá":"🦵","đấm":"✊","ảnh":"🖼️"
    };

    const allCmds = [...global.client.commands.entries()]
      .map(([name], i) => {
        const icon = MODULE_EMOJI[name] || "🎯";
        return `│ ${i + 1}. ${icon} ${name}`;
      })
      .join("\n");

    const menuText =
      "╭─『 🧺 MENU ALL 🧺 』─╮\n" +
      allCmds +
      "\n╰───────────────────────╯\n" +
      "💡 Dùng \"menu + tên lệnh\" để xem chi tiết\n" +
      "⏰ Tự động gỡ sau: 90s";

    return api.sendMessage(menuText, event.threadID, (err, info) => {
      setTimeout(() => api.unsendMessage(info.messageID), 90000);
    });
  }

  // ✅ Phần /menu [số trang] giữ nguyên nguyên vẹn như gốc
  const page = Math.max(1, parseInt(args[0]) || 1);
  const perPage = 10;
  const totalPages = Math.ceil(keys.length / perPage);
  const pageKeys = keys.slice((page - 1) * perPage, page * perPage);

  let text = `╭─━━━━『 ✨ Menu (${page}/${totalPages}) ✨ 』━━━━─\n`;
  pageKeys.forEach((k, i) => {
    const icon = assignUniqueIcon(k);
    const name = disp[k] || k;
    text += `│ ${((page - 1) * perPage) + i + 1}. ${icon} ${name}: ${gr[k].length} lệnh\n`;
  });
  text += "╰─────────────────────────────\n";
  text += `│ 📦 Tổng: ${global.client.commands.size} lệnh\n`;
  text += `│ 📝 Reply số để xem nhóm, 'menu ${page + 1}' để trang sau\n`;
  text += "│ 💡 Gõ 'menu all' để xem tất cả lệnh\n";
  text += "│ ⏳ Tự động gỡ sau: 90s\n";
  text += "│ 📱 Admin: https://www.facebook.com/61575999835460\n";

  return api.sendMessage(text, event.threadID, (err, info) => {
    global.client.handleReply.push({
      name: this.config.name,
      messageID: info.messageID,
      author: event.senderID,
      gr, disp, keys, page, totalPages
    });
    setTimeout(() => api.unsendMessage(info.messageID), 90000);
  });
};
