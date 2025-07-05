    const fs = global.nodemodule['fs-extra']
    module.exports.config = {
      name: 'chuibot',
      version: '1.1.0',
      hasPermssion: 0,
      credits: '\u26A1D-Jukie',
      description: 'T? d?ng ban ngu?i dùng ch?i bot',
      commandCategory: 'H? Th?ng',
      usages: '',
      cooldowns: 0,
    }
    module.exports.handleEvent = async function ({
      api,
      event,
      args,
      Users,
      Threads,
    }) {
      var { threadID, reason } = event,
        id = '' + event.senderID,
        idgr = '' + event.threadID,
        name = (await Users.getData(event.senderID)).name,
        idbox = event.threadID,
        datathread = (await Threads.getData(event.threadID)).threadInfo
      const moment = require('moment-timezone')
      var gio = moment.tz('Asia/Ho_Chi_Minh').format('HH:mm:ss DD/MM/YYYY')
      const time = moment.tz('Asia/Ho_Chi_minh').format('HH:MM:ss L')
      if (!event.body) {
        return
      }
      if (
        event.body.indexOf('ban t di') !== -1 || 
        event.body.indexOf('ban t di') !== -1 ||
        event.body.indexOf('Ban t di') !== -1 ||
        event.body.indexOf('Ban t di') !== -1 ||
        event.body.indexOf('bot nhu lon') !== -1 ||
        event.body.indexOf('Bot nhu lon') !== -1 ||
        event.body.indexOf('bot loz') !== -1 ||
        event.body.indexOf('Bot loz') !== -1 ||
        event.body.indexOf('bot ngu') !== -1 ||
        event.body.indexOf('Bot ngu') !== -1 ||
        event.body.indexOf('botngu') !== -1 ||
        event.body.indexOf('Botngu') !== -1 ||
        event.body.indexOf('bot d?m') !== -1 ||
        event.body.indexOf('Bot d?m') !== -1 ||
        event.body.indexOf('bot rác') !== -1 ||
        event.body.indexOf('bot vô d?ng') !== -1 ||
        event.body.indexOf('bot d?n') !== -1 ||
        event.body.indexOf('bot t?i') !== -1 ||
        event.body.indexOf('bot xàm') !== -1 ||
        event.body.indexOf('bot ngáo') !== -1 ||                 
        event.body.indexOf('bot d?') !== -1 ||                             event.body.indexOf('bot vô tích s?') !== -1 ||
        event.body.indexOf('bot vô giá tr?') !== -1 ||
        event.body.indexOf('bot dáng ghét') !== -1 ||                      event.body.indexOf('bot ch?t ti?t') !== -1 ||
        event.body.indexOf('Bot lazada') !== -1 ||
        event.body.indexOf('bot lazada') !== -1 ||
        event.body.indexOf('Bot shoppe') !== -1 ||
        event.body.indexOf('bot shoppe') !== -1 ||
        event.body.indexOf('bot tiki') !== -1 ||
        event.body.indexOf('Bot tiki') !== -1 ||
        event.body.indexOf('bot óc') !== -1 ||
        event.body.indexOf('botoc') !== -1 ||
        event.body.indexOf('Botoc') !== -1 ||
        event.body.indexOf('Bot óc') !== -1 ||
        event.body.indexOf('dm bot') !== -1 ||
        event.body.indexOf('dmbot') !== -1 ||
        event.body.indexOf('Dmbot') !== -1 ||
        event.body.indexOf('Dm bot') !== -1 ||
        event.body.indexOf('Ðm bot') !== -1 ||
        event.body.indexOf('clmm bot') !== -1 ||
        event.body.indexOf('Clmm bot') !== -1 ||
        event.body.indexOf('bot d?n') !== -1 ||
        event.body.indexOf('Bot d?n') !== -1 ||
        event.body.indexOf('óc bot') !== -1 ||
        event.body.indexOf('Óc bot') !== -1 ||
        event.body.indexOf('Bot l?') !== -1 ||
        event.body.indexOf('kick bot') !== -1 ||
        event.body.indexOf('Kick bot') !== -1 ||
        event.body.indexOf('bot ngáo') !== -1 ||
        event.body.indexOf('Bot ngáo') !== -1 ||
        event.body.indexOf('bot não') !== -1 ||
        event.body.indexOf('Bot não') !== -1 ||
        event.body.indexOf('bot c?c') !== -1 ||
        event.body.indexOf('Bot c?c') !== -1 ||
        event.body.indexOf('bot cac') !== -1 ||
        event.body.indexOf('Bot cac') !== -1 ||
        event.body.indexOf('Bot óc') !== -1 ||
        event.body.indexOf('bot óc') !== -1 ||
        event.body.indexOf('bot lon') !== -1 ||
        event.body.indexOf('Bot lon') !== -1 ||
        event.body.indexOf('Bot l?n') !== -1 ||
        event.body.indexOf('bot l?n') !== -1 ||
        event.body.indexOf('Ð? bot') !== -1 ||
        event.body.indexOf('d? bot') !== -1 ||
        event.body.indexOf('d? bot') !== -1 ||
        event.body.indexOf('Ð? bot') !== -1 ||
        event.body.indexOf('chó bot') !== -1 ||
        event.body.indexOf('Chó bot') !== -1 ||
        event.body.indexOf('Bot chó') !== -1 ||
        event.body.indexOf('bot chó') !== -1 ||
        event.body.indexOf('súc v?t bot') !== -1 ||
        event.body.indexOf('Súc v?t bot') !== -1 ||
        event.body.indexOf('bot này ngu') !== -1 ||
        event.body.indexOf('Bot này ngu') !== -1 ||
        event.body.indexOf('Bot láo') !== -1 ||
        event.body.indexOf('bot láo') !== -1 ||
        event.body.indexOf('dcm bot') !== -1 ||
        event.body.indexOf('Dcm bot') !== -1 ||
        event.body.indexOf('bot m?t d?y') !== -1 ||
        event.body.indexOf('Bot m?t d?y') !== -1 ||
        event.body.indexOf('botoccho') !== -1 ||
        event.body.indexOf('Botoccho') !== -1 ||
        event.body.indexOf('Bot rác') !== -1 ||
        event.body.indexOf('bot rác') !== -1 ||
        event.body.indexOf('Bot rac') !== -1 ||
        event.body.indexOf('bot rac') !== -1 ||
        event.body.indexOf('Botrac') !== -1 ||
        event.body.indexOf('botrac') !== -1 ||
        event.body.indexOf('bot ncc') !== -1 ||
        event.body.indexOf('Bot ncc') !== -1 ||
        event.body.indexOf('bot l?') !== -1 ||
        event.body.indexOf("bot cc") !== -1 ||
        event.body.indexOf("bot Cc") !== -1 ||
        event.body.indexOf('bot ncl') !== -1 ||
        event.body.indexOf('Bot ncl') !== -1 ||
        event.body.indexOf('bot cút') !== -1 ||
        event.body.indexOf('Bot cút') !== -1 ||
        event.body.indexOf('Bot d?m') !== -1 ||
        event.body.indexOf('bot d?m') !== -1 ||
        event.body.indexOf('Cút di bot') !== -1 ||
        event.body.indexOf('cút di bot') !== -1 ||
        event.body.indexOf('admin ngu') !== -1 ||
        event.body.indexOf('Admin chó') !== -1 ||
        event.body.indexOf('admin d?u') !== -1 ||
        event.body.indexOf('Admin ngu') !== -1 ||
        event.body.indexOf('Admin sv') !== -1 ||
        event.body.indexOf('admin l?n') !== -1 ||
        event.body.indexOf('Admin óc') !== -1 ||
        event.body.indexOf('Bot I?n') !== -1 ||
        event.body.indexOf('Admin rác') !== -1 ||
        event.body.indexOf('admin rác') !== -1 ||
        event.body.indexOf('Admin ncc') !== -1 ||
        event.body.indexOf('bot I?n') !== -1 ||
        event.body.indexOf('Bot fake') !== -1 ||
        event.body.indexOf('Botloz') !== -1
      ) {
        let data = (await Users.getData(id)).data || {}
        var namethread = datathread.threadName
         api.removeUserFromGroup(id, threadID)
        return (
          (data.banned = true),
          (data.reason = 'Ch?i bot' || null),
          (data.dateAdded = time),
          await Users.setData(id, { data: data }),
          global.data.userBanned.set(id, {
            reason: data.reason,
            dateAdded: data.dateAdded,
          }),
          api.sendMessage(
    '? ????????? User Ban ????????? ?' + '\n' +
    '| ? B?n Ðã B? Ban' + ' | ' + ' Ch?i Bot , Admin' + '\n' +
    '| ? Tên : ' + name + '\n' +
    '| ? Tid : ' + idgr + '\n' +
    '| ? Admin said you : Tao khinh ??' + '\n' +
    '| ? Xin G? Ban Qua : ' + 'fb.me/61575999835460' + '\n' +
    '????????????????????????????',
            threadID,
            () => {
              var idd = global.config.ADMINBOT
              for (let idad of idd) {
                api.sendMessage(
    '? ????????? User Ban ????????? ?' + '\n' +
    '| ? ' + name + ' nhóm ' + namethread + '\n' +
    '| ? Ch?i Bot : ' + event.body + '\n' +
    '| ? Lúc : ' + gio + '\n' +
    '| ? Id Nhóm : ' + idgr + '\n' +
    '| ? Facebook.com/' + id + '\n' +
    '????????????????????????????', 
                  idad
                )
              }
            }
          )
        )

      } else {
        return
      }
    }
    module.exports.run = async function ({
      api,
      event,
      args,
      Users,
      Threads,
      __GLOBAL,
    }) {
      api.sendMessage(
        `??T? d?ng ban khi ch?i bot??`,
        event.threadID,
        event.messageID
      )
    }
