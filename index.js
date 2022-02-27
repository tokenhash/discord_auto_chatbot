const Discord = require('discord.js-v11-stable');
const config = require('./config.json')

const bot = config.bot

const msgChannel = config.msgChannel

const targetChannel = config.targetChannel


function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function runBot(name, token) {
    return new Promise((resolve, reject) => {
      const client = new Discord.Client();
      client.on('ready', async () => {
          console.log(name, 'is ready!')
          resolve(client)
      })
      client.login(token)
    })
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function sendMsg(client, msg, channelId) {
    try {
      console.log("send", msg)
      var channel = client.channels.get(channelId)
      await channel.send(msg.content)
    } catch (error) {
      console.log(error)
    }
}

async function loopSendMsg(bot, ts, channelId, data) {
    while(true) {
        try {
            if(data.length <= 0) {
                await sleep(10 * 1000)
                continue
            }
            // 挑一条记录，这里选择最后一条，这里可以按自己的想法改
            const msg = data.pop()
            await sendMsg(bot, msg, channelId)
            await sleep(getRandomInt(ts, ts + 10) * 1000)            
        } catch (error) {
            
        }
    }
}


async function main() {

    var msgs = []

    var chatbot = await runBot(bot.name, bot.token)

    chatbot.on('message', message => {
        if(message.channel.id == msgChannel.id && message.channel.type == 'text'){
          if(message.content.includes('<')) {
            return
          }
          if(message.content.includes('@')) {
            return
          }
          if(message.content.includes('>')) {
            return
          }
          var msg = {}
          msg.authorId = message.author.id
          msg.authorUsername = message.author.username
          msg.content = message.content
          console.log(msg.authorUsername, message.content)
        
          // 把聊天记录存起来
          msgs.push(msg)
        }
    });

    await loopSendMsg(chatbot, 1, targetChannel.id, msgs)

}

main()