//add discord selfbot
const fs = require('fs');
const idrm = require('short-unique-id');
const idr = new idrm({ length: 10 });
const { AceBase } = require('acebase');
let wdb = new AceBase('wall', {
    logLevel: 'error',
    path: "../data/"
});
const { Client } = require('discord.js-selfbot-v13');
const client = new Client({});
let last = "1138627558875869205";
let stats = {
    recived: 0,
    walls: 0
}
let gid = 10000;
//let db = JSON.parse(fs.readFileSync(__dirname + '/db.json', 'utf8'));
const start = new Date().getTime();
client.on('ready', async () => {
    console.log(`${client.user.username} in ${client.readyTimestamp-start}ms`);
    startCollection();
});
function startCollection(){ 
    const channel = client.channels.cache.get("635625973764849684");
    //channel.messages.fetch({ id: "1138439387982614609", limit: 100 })
    channel.messages.fetch({ before: last, limit: 100 }).then(messages => {
        stats.recived += messages.size;
        let adds = 0;
        //Iterate through the messages here with the variable "messages".
        let chunk = {};
        messages.forEach(message => {
            //log all images from messages
            if(message.attachments.size > 0){
                message.attachments.each(attachment => {
                    chunk[idr()] = {
                        url: attachment.url,
                        authorID: message.author.id,
                        messageID: message.id
                    };
                    adds++;
                });
            }
            //also log all images from embeds
            if(message.embeds.length > 0){
                message.embeds.forEach(embed => {
                    if(embed.type == "image"){
                        if(embed.thumbnail == undefined) return;
                        chunk[idr()] = {
                            srcUrl: embed.url,
                            proxiedUrl: embed.thumbnail.proxyURL,
                            authorID: message.author.id,
                            messageID: message.id
                        }
                        adds++;
                    }
                });
            }
            //if this is last message in 100 chunk, set last to it's id
            if(message.id == messages.last().id){
                last = message.id;
                fs.writeFileSync(__dirname + '/last', last);
            }
        });
        stats.walls += adds;
        console.log(`${adds} new, ${stats.walls} total, ${stats.recived} recived`);
        upload(chunk);
        startCollection();
    });
}
//make this a ref().update() instead of set() (bulk add)
async function upload(json){
    for(let i in json){
        if(json[i] == undefined){
            delete json[i];
            continue;
        }
        json[i].number = gid;
        gid++;
    }
    wdb.ref("/walls").update(json);
}
//24600 total, 77612 recived
client.login(fs.readFileSync(__dirname + '/token', 'utf8'));